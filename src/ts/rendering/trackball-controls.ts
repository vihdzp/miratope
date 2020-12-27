/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io

 ** three-trackballcontrols module
 ** @author Jon Lim / https://jonlim.ca
 */

import * as THREE from "three";

const EPS = 0.000001;

enum STATE {
  NONE = -1,
  ROTATE = 0,
  ZOOM = 1,
  PAN = 2,
  TOUCH_ROTATE = 3,
  TOUCH_ZOOM_PAN = 4,
}

const EVENT = {
  change: { type: "change" },
  start: { type: "start" },
  end: { type: "end" },
};

interface Screen {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default class TrackballControls extends THREE.EventDispatcher {
  object: THREE.PerspectiveCamera;
  domElement: HTMLCanvasElement;

  //API
  enabled = true;

  screen: Screen = { left: 0, top: 0, width: 0, height: 0 };

  rotateSpeed = 1.0;
  zoomSpeed = 1.2;
  panSpeed = 0.3;

  noRotate = false;
  noZoom = false;
  noPan = false;

  staticMoving = false;
  dynamicDampingFactor = 0.2;

  minDistance = 0;
  maxDistance = Infinity;

  target = new THREE.Vector3();

  readonly lastPosition = new THREE.Vector3();

  //internals
  private state = STATE.NONE;
  private keyState = STATE.NONE;

  private eye = new THREE.Vector3();

  private moveCurr = new THREE.Vector2();
  private movePrev = new THREE.Vector2();

  private lastAxis = new THREE.Vector3();
  private lastAngle = 0;

  private zoomStart = new THREE.Vector2();
  private zoomEnd = new THREE.Vector2();

  private touchZoomDistanceStart = 0;
  private touchZoomDistanceEnd = 0;

  private panStart = new THREE.Vector2();
  private panEnd = new THREE.Vector2();

  //For reset
  private target0: THREE.Vector3;
  private position0: THREE.Vector3;
  private up0: THREE.Vector3;
  private zoom0: number;

  /**
   * `KeyboardEvent.keyCode` values which should trigger the different
   * interaction states. Each element can be a single code or an array
   * of codes. All elements are required.
   */
  readonly keys = ["a", "s", "d"];

  /**
   * `Event` for pointer interactions which should trigger different
   * interaction states.
   */
  readonly mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.MIDDLE,
    RIGHT: THREE.MOUSE.PAN,
  };

  constructor(object: THREE.PerspectiveCamera, domElement: HTMLCanvasElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    //Terrible hack, fix this pls
    globalThis.trackball = this;

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();
    this.zoom0 = this.object.zoom;

    this.domElement.addEventListener(
      "contextmenu",
      TrackballControls.contextmenu,
      false
    );

    this.domElement.addEventListener(
      "pointerdown",
      TrackballControls.onPointerDown,
      false
    );
    this.domElement.addEventListener(
      "wheel",
      TrackballControls.mousewheel,
      false
    );

    this.domElement.addEventListener(
      "touchstart",
      TrackballControls.touchstart,
      false
    );
    this.domElement.addEventListener(
      "touchend",
      TrackballControls.touchend,
      false
    );
    this.domElement.addEventListener(
      "touchmove",
      TrackballControls.touchmove,
      false
    );

    this.domElement.ownerDocument.addEventListener(
      "pointermove",
      TrackballControls.onPointerMove,
      false
    );
    this.domElement.ownerDocument.addEventListener(
      "pointerup",
      TrackballControls.onPointerUp,
      false
    );

    globalThis.addEventListener("keydown", TrackballControls.keydown, false);
    globalThis.addEventListener("keyup", TrackballControls.keyup, false);

    this.handleResize();

    // force an update at start
    //this.update();
  }

  handleResize(): void {
    const box = this.domElement.getBoundingClientRect();
    // Adjustments come from similar code in the jquery offset() function.
    const d = this.domElement.ownerDocument.documentElement;
    this.screen.left = box.left + globalThis.pageXOffset - d.clientLeft;
    this.screen.top = box.top + globalThis.pageYOffset - d.clientTop;
    this.screen.width = box.width;
    this.screen.height = box.height;
  }

  getMouseOnScreen(pageX: number, pageY: number): THREE.Vector2 {
    return new THREE.Vector2(
      (pageX - this.screen.left) / this.screen.width,
      (pageY - this.screen.top) / this.screen.height
    );
  }

  getMouseOnCircle(pageX: number, pageY: number): THREE.Vector2 {
    return new THREE.Vector2(
      (pageX - this.screen.width * 0.5 - this.screen.left) /
        (this.screen.width * 0.5),
      (this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width
    );
  }

  rotateCamera(): void {
    const axis = new THREE.Vector3(),
      quaternion = new THREE.Quaternion(),
      eyeDirection = new THREE.Vector3(),
      objectUpDirection = new THREE.Vector3(),
      objectSidewaysDirection = new THREE.Vector3(),
      moveDirection = new THREE.Vector3();
    let angle: number;

    moveDirection.set(
      this.moveCurr.x - this.movePrev.x,
      this.moveCurr.y - this.movePrev.y,
      0
    );
    angle = moveDirection.length();

    if (angle) {
      this.eye.copy(this.object.position).sub(this.target);

      eyeDirection.copy(this.eye).normalize();
      objectUpDirection.copy(this.object.up).normalize();
      objectSidewaysDirection
        .crossVectors(objectUpDirection, eyeDirection)
        .normalize();

      objectUpDirection.setLength(this.moveCurr.y - this.movePrev.y);
      objectSidewaysDirection.setLength(this.moveCurr.x - this.movePrev.x);

      moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

      axis.crossVectors(moveDirection, this.eye).normalize();

      angle *= this.rotateSpeed;
      quaternion.setFromAxisAngle(axis, angle);

      this.eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);

      this.lastAxis.copy(axis);
      this.lastAngle = angle;
    } else if (!this.staticMoving && this.lastAngle) {
      this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
      this.eye.copy(this.object.position).sub(this.target);
      quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
      this.eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);
    }

    this.movePrev.copy(this.moveCurr);
  }

  zoomCamera(): void {
    let factor: number;

    if (this.state === STATE.TOUCH_ZOOM_PAN) {
      factor = this.touchZoomDistanceStart / this.touchZoomDistanceEnd;
      this.touchZoomDistanceStart = this.touchZoomDistanceEnd;
      this.eye.multiplyScalar(factor);
    } else {
      factor = 1.0 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
      if (factor !== 1.0 && factor > 0.0) this.eye.multiplyScalar(factor);

      if (this.staticMoving) this.zoomStart.copy(this.zoomEnd);
      else
        this.zoomStart.y +=
          (this.zoomEnd.y - this.zoomStart.y) * this.dynamicDampingFactor;
    }
  }

  panCamera(): void {
    const mouseChange = new THREE.Vector2(),
      objectUp = new THREE.Vector3(),
      pan = new THREE.Vector3();

    mouseChange.copy(this.panEnd).sub(this.panStart);

    if (mouseChange.lengthSq()) {
      mouseChange.multiplyScalar(this.eye.length() * this.panSpeed);

      pan.copy(this.eye).cross(this.object.up).setLength(mouseChange.x);
      pan.add(objectUp.copy(this.object.up).setLength(mouseChange.y));

      this.object.position.add(pan);
      this.target.add(pan);

      if (this.staticMoving) this.panStart.copy(this.panEnd);
      else
        this.panStart.add(
          mouseChange
            .subVectors(this.panEnd, this.panStart)
            .multiplyScalar(this.dynamicDampingFactor)
        );
    }
  }

  checkDistances(): void {
    if (!this.noZoom || !this.noPan) {
      if (this.eye.lengthSq() > this.maxDistance * this.maxDistance) {
        this.object.position.addVectors(
          this.target,
          this.eye.setLength(this.maxDistance)
        );
        this.zoomStart.copy(this.zoomEnd);
      }

      if (this.eye.lengthSq() < this.minDistance * this.minDistance) {
        this.object.position.addVectors(
          this.target,
          this.eye.setLength(this.minDistance)
        );
        this.zoomStart.copy(this.zoomEnd);
      }
    }
  }

  update(): void {
    this.eye.subVectors(this.object.position, this.target);

    if (!this.noRotate) this.rotateCamera();

    if (!this.noZoom) this.zoomCamera();

    if (!this.noPan) this.panCamera();

    this.object.position.addVectors(this.target, this.eye);
    this.checkDistances();
    this.object.lookAt(this.target);

    if (this.lastPosition.distanceToSquared(this.object.position) > EPS) {
      this.dispatchEvent(EVENT.change);
      this.lastPosition.copy(this.object.position);
    }
  }

  reset(): void {
    this.state = STATE.NONE;
    this.keyState = STATE.NONE;

    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    this.object.up.copy(this.up0);
    this.object.zoom = this.zoom0;

    this.eye.subVectors(this.object.position, this.target);

    this.object.lookAt(this.target);

    this.dispatchEvent(EVENT.change);

    this.lastPosition.copy(this.object.position);
  }

  // Listeners
  static onPointerDown(this: HTMLCanvasElement, event: PointerEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    switch (event.pointerType) {
      case "mouse":
      case "pen":
        TrackballControls.onMouseDown(event);
        break;

      // TODO touch
    }
  }

  static onPointerMove(this: Document, event: PointerEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    switch (event.pointerType) {
      case "mouse":
      case "pen":
        TrackballControls.onMouseMove(event);
        break;

      // TODO touch
    }
  }

  static onPointerUp(this: Document, event: PointerEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    switch (event.pointerType) {
      case "mouse":
      case "pen":
        TrackballControls.onMouseUp(event);
        break;

      // TODO touch
    }
  }

  static keydown(this: Window, event: KeyboardEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    globalThis.removeEventListener("keydown", TrackballControls.keydown);

    if (trackball.keyState !== STATE.NONE) return;
    else if (event.key === trackball.keys[STATE.ROTATE] && !trackball.noRotate)
      trackball.keyState = STATE.ROTATE;
    else if (event.key === trackball.keys[STATE.ZOOM] && !trackball.noZoom)
      trackball.keyState = STATE.ZOOM;
    else if (event.key === trackball.keys[STATE.PAN] && !trackball.noPan)
      trackball.keyState = STATE.PAN;
  }

  static keyup(): void {
    const trackball = globalThis.trackball;
    if (!trackball.enabled) return;

    trackball.keyState = STATE.NONE;

    globalThis.addEventListener("keydown", TrackballControls.keydown, false);
  }

  static onMouseDown(event: MouseEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    event.preventDefault();
    event.stopPropagation();

    if (trackball.state === STATE.NONE) {
      switch (event.button) {
        case trackball.mouseButtons.LEFT:
          trackball.state = STATE.ROTATE;
          break;
        case trackball.mouseButtons.MIDDLE:
          trackball.state = STATE.ZOOM;
          break;
        case trackball.mouseButtons.RIGHT:
          trackball.state = STATE.PAN;
          break;
        default:
          trackball.state = STATE.NONE;
      }
    }

    const state =
      trackball.keyState !== STATE.NONE ? trackball.keyState : trackball.state;

    if (state === STATE.ROTATE && !trackball.noRotate) {
      trackball.moveCurr.copy(
        trackball.getMouseOnCircle(event.pageX, event.pageY)
      );
      trackball.movePrev.copy(trackball.moveCurr);
    } else if (state === STATE.ZOOM && !trackball.noZoom) {
      trackball.zoomStart.copy(
        trackball.getMouseOnScreen(event.pageX, event.pageY)
      );
      trackball.zoomEnd.copy(trackball.zoomStart);
    } else if (state === STATE.PAN && !trackball.noPan) {
      trackball.panStart.copy(
        trackball.getMouseOnScreen(event.pageX, event.pageY)
      );
      trackball.panEnd.copy(trackball.panStart);
    }

    trackball.domElement.ownerDocument.addEventListener(
      "pointermove",
      TrackballControls.onPointerMove,
      false
    );
    trackball.domElement.ownerDocument.addEventListener(
      "pointerup",
      TrackballControls.onPointerUp,
      false
    );

    trackball.dispatchEvent(EVENT.start);
  }

  static onMouseMove(event: MouseEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    event.preventDefault();
    event.stopPropagation();

    const state =
      trackball.keyState !== STATE.NONE ? trackball.keyState : trackball.state;

    if (state === STATE.ROTATE && !trackball.noRotate) {
      trackball.movePrev.copy(trackball.moveCurr);
      trackball.moveCurr.copy(
        trackball.getMouseOnCircle(event.pageX, event.pageY)
      );
    } else if (state === STATE.ZOOM && !trackball.noZoom)
      trackball.zoomEnd.copy(
        trackball.getMouseOnScreen(event.pageX, event.pageY)
      );
    else if (state === STATE.PAN && !trackball.noPan)
      trackball.panEnd.copy(
        trackball.getMouseOnScreen(event.pageX, event.pageY)
      );
  }

  static onMouseUp(event: MouseEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    event.preventDefault();
    event.stopPropagation();

    trackball.state = STATE.NONE;

    trackball.domElement.ownerDocument.removeEventListener(
      "pointermove",
      TrackballControls.onPointerMove
    );
    trackball.domElement.ownerDocument.removeEventListener(
      "pointerup",
      TrackballControls.onPointerUp
    );
    trackball.dispatchEvent(EVENT.end);
  }

  static mousewheel(this: HTMLCanvasElement, event: WheelEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;
    if (trackball.noZoom === true) return;

    event.preventDefault();
    event.stopPropagation();

    switch (event.deltaMode) {
      case 2:
        // Zoom in pages
        trackball.zoomStart.y -= event.deltaY * 0.025;
        break;
      case 1:
        // Zoom in lines
        trackball.zoomStart.y -= event.deltaY * 0.01;
        break;
      default:
        // undefined, 0, assume pixels
        trackball.zoomStart.y -= event.deltaY * 0.00025;
        break;
    }

    trackball.dispatchEvent(EVENT.start);
    trackball.dispatchEvent(EVENT.start);
  }

  static touchstart(event: TouchEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    event.preventDefault();

    switch (event.touches.length) {
      case 1:
        trackball.state = STATE.TOUCH_ROTATE;
        trackball.moveCurr.copy(
          trackball.getMouseOnCircle(
            event.touches[0].pageX,
            event.touches[0].pageY
          )
        );
        trackball.movePrev.copy(trackball.moveCurr);
        break;
      default:
        // 2 or more
        trackball.state = STATE.TOUCH_ZOOM_PAN;
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        trackball.touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
        trackball.touchZoomDistanceStart = trackball.touchZoomDistanceEnd;

        const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        trackball.panStart.copy(trackball.getMouseOnScreen(x, y));
        trackball.panEnd.copy(trackball.panStart);
        break;
    }

    trackball.dispatchEvent(EVENT.start);
  }

  static touchmove(this: HTMLCanvasElement, event: TouchEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {
      case 1:
        trackball.movePrev.copy(trackball.moveCurr);
        trackball.moveCurr.copy(
          trackball.getMouseOnCircle(
            event.touches[0].pageX,
            event.touches[0].pageY
          )
        );
        break;
      default:
        // 2 or more
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        trackball.touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

        const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        trackball.panEnd.copy(trackball.getMouseOnScreen(x, y));
        break;
    }
  }

  static touchend(this: HTMLCanvasElement, event: TouchEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    switch (event.touches.length) {
      case 0:
        trackball.state = STATE.NONE;
        break;
      case 1:
        trackball.state = STATE.TOUCH_ROTATE;
        trackball.moveCurr.copy(
          trackball.getMouseOnCircle(
            event.touches[0].pageX,
            event.touches[0].pageY
          )
        );
        trackball.movePrev.copy(trackball.moveCurr);
        break;
    }

    trackball.dispatchEvent(EVENT.end);
  }

  static contextmenu(this: HTMLCanvasElement, event: MouseEvent): void {
    const trackball: TrackballControls = globalThis.trackball;
    if (!trackball.enabled) return;

    event.preventDefault();
  }

  dispose(): void {
    this.domElement.removeEventListener(
      "contextmenu",
      TrackballControls.contextmenu,
      false
    );
    this.domElement.removeEventListener(
      "pointerdown",
      TrackballControls.onPointerDown,
      false
    );
    this.domElement.removeEventListener(
      "wheel",
      TrackballControls.mousewheel,
      false
    );

    this.domElement.removeEventListener(
      "touchstart",
      TrackballControls.touchstart,
      false
    );
    this.domElement.removeEventListener(
      "touchend",
      TrackballControls.touchend,
      false
    );
    this.domElement.removeEventListener(
      "touchmove",
      TrackballControls.touchmove,
      false
    );

    this.domElement.ownerDocument.removeEventListener(
      "pointermove",
      TrackballControls.onPointerMove,
      false
    );
    this.domElement.ownerDocument.removeEventListener(
      "pointerup",
      TrackballControls.onPointerUp,
      false
    );

    globalThis.removeEventListener("keydown", TrackballControls.keydown, false);
    globalThis.removeEventListener("keyup", TrackballControls.keyup, false);
  }
}
