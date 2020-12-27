import * as Globalize from "globalize";

/** Loads the necessary CLDR JSON files for Globalize to work. */
export default function loadJSON(): void {
  //likelySubtags.json
  Globalize.load({
    supplemental: {
      version: {
        _unicodeVersion: "13.0.0",
        _cldrVersion: "37",
      },
      likelySubtags: {
        aa: "aa-Latn-ET",
        aai: "aai-Latn-ZZ",
        aak: "aak-Latn-ZZ",
        aau: "aau-Latn-ZZ",
        ab: "ab-Cyrl-GE",
        abi: "abi-Latn-ZZ",
        abq: "abq-Cyrl-ZZ",
        abr: "abr-Latn-GH",
        abt: "abt-Latn-ZZ",
        aby: "aby-Latn-ZZ",
        acd: "acd-Latn-ZZ",
        ace: "ace-Latn-ID",
        ach: "ach-Latn-UG",
        ada: "ada-Latn-GH",
        ade: "ade-Latn-ZZ",
        adj: "adj-Latn-ZZ",
        adp: "adp-Tibt-BT",
        ady: "ady-Cyrl-RU",
        adz: "adz-Latn-ZZ",
        ae: "ae-Avst-IR",
        aeb: "aeb-Arab-TN",
        aey: "aey-Latn-ZZ",
        af: "af-Latn-ZA",
        agc: "agc-Latn-ZZ",
        agd: "agd-Latn-ZZ",
        agg: "agg-Latn-ZZ",
        agm: "agm-Latn-ZZ",
        ago: "ago-Latn-ZZ",
        agq: "agq-Latn-CM",
        aha: "aha-Latn-ZZ",
        ahl: "ahl-Latn-ZZ",
        aho: "aho-Ahom-IN",
        ajg: "ajg-Latn-ZZ",
        ak: "ak-Latn-GH",
        akk: "akk-Xsux-IQ",
        ala: "ala-Latn-ZZ",
        ali: "ali-Latn-ZZ",
        aln: "aln-Latn-XK",
        alt: "alt-Cyrl-RU",
        am: "am-Ethi-ET",
        amm: "amm-Latn-ZZ",
        amn: "amn-Latn-ZZ",
        amo: "amo-Latn-NG",
        amp: "amp-Latn-ZZ",
        an: "an-Latn-ES",
        anc: "anc-Latn-ZZ",
        ank: "ank-Latn-ZZ",
        ann: "ann-Latn-ZZ",
        any: "any-Latn-ZZ",
        aoj: "aoj-Latn-ZZ",
        aom: "aom-Latn-ZZ",
        aoz: "aoz-Latn-ID",
        apc: "apc-Arab-ZZ",
        apd: "apd-Arab-TG",
        ape: "ape-Latn-ZZ",
        apr: "apr-Latn-ZZ",
        aps: "aps-Latn-ZZ",
        apz: "apz-Latn-ZZ",
        ar: "ar-Arab-EG",
        arc: "arc-Armi-IR",
        "arc-Nbat": "arc-Nbat-JO",
        "arc-Palm": "arc-Palm-SY",
        arh: "arh-Latn-ZZ",
        arn: "arn-Latn-CL",
        aro: "aro-Latn-BO",
        arq: "arq-Arab-DZ",
        ars: "ars-Arab-SA",
        ary: "ary-Arab-MA",
        arz: "arz-Arab-EG",
        as: "as-Beng-IN",
        asa: "asa-Latn-TZ",
        ase: "ase-Sgnw-US",
        asg: "asg-Latn-ZZ",
        aso: "aso-Latn-ZZ",
        ast: "ast-Latn-ES",
        ata: "ata-Latn-ZZ",
        atg: "atg-Latn-ZZ",
        atj: "atj-Latn-CA",
        auy: "auy-Latn-ZZ",
        av: "av-Cyrl-RU",
        avl: "avl-Arab-ZZ",
        avn: "avn-Latn-ZZ",
        avt: "avt-Latn-ZZ",
        avu: "avu-Latn-ZZ",
        awa: "awa-Deva-IN",
        awb: "awb-Latn-ZZ",
        awo: "awo-Latn-ZZ",
        awx: "awx-Latn-ZZ",
        ay: "ay-Latn-BO",
        ayb: "ayb-Latn-ZZ",
        az: "az-Latn-AZ",
        "az-Arab": "az-Arab-IR",
        "az-IQ": "az-Arab-IQ",
        "az-IR": "az-Arab-IR",
        "az-RU": "az-Cyrl-RU",
        ba: "ba-Cyrl-RU",
        bal: "bal-Arab-PK",
        ban: "ban-Latn-ID",
        bap: "bap-Deva-NP",
        bar: "bar-Latn-AT",
        bas: "bas-Latn-CM",
        bav: "bav-Latn-ZZ",
        bax: "bax-Bamu-CM",
        bba: "bba-Latn-ZZ",
        bbb: "bbb-Latn-ZZ",
        bbc: "bbc-Latn-ID",
        bbd: "bbd-Latn-ZZ",
        bbj: "bbj-Latn-CM",
        bbp: "bbp-Latn-ZZ",
        bbr: "bbr-Latn-ZZ",
        bcf: "bcf-Latn-ZZ",
        bch: "bch-Latn-ZZ",
        bci: "bci-Latn-CI",
        bcm: "bcm-Latn-ZZ",
        bcn: "bcn-Latn-ZZ",
        bco: "bco-Latn-ZZ",
        bcq: "bcq-Ethi-ZZ",
        bcu: "bcu-Latn-ZZ",
        bdd: "bdd-Latn-ZZ",
        be: "be-Cyrl-BY",
        bef: "bef-Latn-ZZ",
        beh: "beh-Latn-ZZ",
        bej: "bej-Arab-SD",
        bem: "bem-Latn-ZM",
        bet: "bet-Latn-ZZ",
        bew: "bew-Latn-ID",
        bex: "bex-Latn-ZZ",
        bez: "bez-Latn-TZ",
        bfd: "bfd-Latn-CM",
        bfq: "bfq-Taml-IN",
        bft: "bft-Arab-PK",
        bfy: "bfy-Deva-IN",
        bg: "bg-Cyrl-BG",
        bgc: "bgc-Deva-IN",
        bgn: "bgn-Arab-PK",
        bgx: "bgx-Grek-TR",
        bhb: "bhb-Deva-IN",
        bhg: "bhg-Latn-ZZ",
        bhi: "bhi-Deva-IN",
        bhl: "bhl-Latn-ZZ",
        bho: "bho-Deva-IN",
        bhy: "bhy-Latn-ZZ",
        bi: "bi-Latn-VU",
        bib: "bib-Latn-ZZ",
        big: "big-Latn-ZZ",
        bik: "bik-Latn-PH",
        bim: "bim-Latn-ZZ",
        bin: "bin-Latn-NG",
        bio: "bio-Latn-ZZ",
        biq: "biq-Latn-ZZ",
        bjh: "bjh-Latn-ZZ",
        bji: "bji-Ethi-ZZ",
        bjj: "bjj-Deva-IN",
        bjn: "bjn-Latn-ID",
        bjo: "bjo-Latn-ZZ",
        bjr: "bjr-Latn-ZZ",
        bjt: "bjt-Latn-SN",
        bjz: "bjz-Latn-ZZ",
        bkc: "bkc-Latn-ZZ",
        bkm: "bkm-Latn-CM",
        bkq: "bkq-Latn-ZZ",
        bku: "bku-Latn-PH",
        bkv: "bkv-Latn-ZZ",
        blt: "blt-Tavt-VN",
        bm: "bm-Latn-ML",
        bmh: "bmh-Latn-ZZ",
        bmk: "bmk-Latn-ZZ",
        bmq: "bmq-Latn-ML",
        bmu: "bmu-Latn-ZZ",
        bn: "bn-Beng-BD",
        bng: "bng-Latn-ZZ",
        bnm: "bnm-Latn-ZZ",
        bnp: "bnp-Latn-ZZ",
        bo: "bo-Tibt-CN",
        boj: "boj-Latn-ZZ",
        bom: "bom-Latn-ZZ",
        bon: "bon-Latn-ZZ",
        bpy: "bpy-Beng-IN",
        bqc: "bqc-Latn-ZZ",
        bqi: "bqi-Arab-IR",
        bqp: "bqp-Latn-ZZ",
        bqv: "bqv-Latn-CI",
        br: "br-Latn-FR",
        bra: "bra-Deva-IN",
        brh: "brh-Arab-PK",
        brx: "brx-Deva-IN",
        brz: "brz-Latn-ZZ",
        bs: "bs-Latn-BA",
        bsj: "bsj-Latn-ZZ",
        bsq: "bsq-Bass-LR",
        bss: "bss-Latn-CM",
        bst: "bst-Ethi-ZZ",
        bto: "bto-Latn-PH",
        btt: "btt-Latn-ZZ",
        btv: "btv-Deva-PK",
        bua: "bua-Cyrl-RU",
        buc: "buc-Latn-YT",
        bud: "bud-Latn-ZZ",
        bug: "bug-Latn-ID",
        buk: "buk-Latn-ZZ",
        bum: "bum-Latn-CM",
        buo: "buo-Latn-ZZ",
        bus: "bus-Latn-ZZ",
        buu: "buu-Latn-ZZ",
        bvb: "bvb-Latn-GQ",
        bwd: "bwd-Latn-ZZ",
        bwr: "bwr-Latn-ZZ",
        bxh: "bxh-Latn-ZZ",
        bye: "bye-Latn-ZZ",
        byn: "byn-Ethi-ER",
        byr: "byr-Latn-ZZ",
        bys: "bys-Latn-ZZ",
        byv: "byv-Latn-CM",
        byx: "byx-Latn-ZZ",
        bza: "bza-Latn-ZZ",
        bze: "bze-Latn-ML",
        bzf: "bzf-Latn-ZZ",
        bzh: "bzh-Latn-ZZ",
        bzw: "bzw-Latn-ZZ",
        ca: "ca-Latn-ES",
        cad: "cad-Latn-US",
        can: "can-Latn-ZZ",
        cbj: "cbj-Latn-ZZ",
        cch: "cch-Latn-NG",
        ccp: "ccp-Cakm-BD",
        ce: "ce-Cyrl-RU",
        ceb: "ceb-Latn-PH",
        cfa: "cfa-Latn-ZZ",
        cgg: "cgg-Latn-UG",
        ch: "ch-Latn-GU",
        chk: "chk-Latn-FM",
        chm: "chm-Cyrl-RU",
        cho: "cho-Latn-US",
        chp: "chp-Latn-CA",
        chr: "chr-Cher-US",
        cic: "cic-Latn-US",
        cja: "cja-Arab-KH",
        cjm: "cjm-Cham-VN",
        cjv: "cjv-Latn-ZZ",
        ckb: "ckb-Arab-IQ",
        ckl: "ckl-Latn-ZZ",
        cko: "cko-Latn-ZZ",
        cky: "cky-Latn-ZZ",
        cla: "cla-Latn-ZZ",
        cme: "cme-Latn-ZZ",
        cmg: "cmg-Soyo-MN",
        co: "co-Latn-FR",
        cop: "cop-Copt-EG",
        cps: "cps-Latn-PH",
        cr: "cr-Cans-CA",
        crh: "crh-Cyrl-UA",
        crj: "crj-Cans-CA",
        crk: "crk-Cans-CA",
        crl: "crl-Cans-CA",
        crm: "crm-Cans-CA",
        crs: "crs-Latn-SC",
        cs: "cs-Latn-CZ",
        csb: "csb-Latn-PL",
        csw: "csw-Cans-CA",
        ctd: "ctd-Pauc-MM",
        cu: "cu-Cyrl-RU",
        "cu-Glag": "cu-Glag-BG",
        cv: "cv-Cyrl-RU",
        cy: "cy-Latn-GB",
        da: "da-Latn-DK",
        dad: "dad-Latn-ZZ",
        daf: "daf-Latn-ZZ",
        dag: "dag-Latn-ZZ",
        dah: "dah-Latn-ZZ",
        dak: "dak-Latn-US",
        dar: "dar-Cyrl-RU",
        dav: "dav-Latn-KE",
        dbd: "dbd-Latn-ZZ",
        dbq: "dbq-Latn-ZZ",
        dcc: "dcc-Arab-IN",
        ddn: "ddn-Latn-ZZ",
        de: "de-Latn-DE",
        ded: "ded-Latn-ZZ",
        den: "den-Latn-CA",
        dga: "dga-Latn-ZZ",
        dgh: "dgh-Latn-ZZ",
        dgi: "dgi-Latn-ZZ",
        dgl: "dgl-Arab-ZZ",
        dgr: "dgr-Latn-CA",
        dgz: "dgz-Latn-ZZ",
        dia: "dia-Latn-ZZ",
        dje: "dje-Latn-NE",
        dnj: "dnj-Latn-CI",
        dob: "dob-Latn-ZZ",
        doi: "doi-Arab-IN",
        dop: "dop-Latn-ZZ",
        dow: "dow-Latn-ZZ",
        drh: "drh-Mong-CN",
        dri: "dri-Latn-ZZ",
        drs: "drs-Ethi-ZZ",
        dsb: "dsb-Latn-DE",
        dtm: "dtm-Latn-ML",
        dtp: "dtp-Latn-MY",
        dts: "dts-Latn-ZZ",
        dty: "dty-Deva-NP",
        dua: "dua-Latn-CM",
        duc: "duc-Latn-ZZ",
        dud: "dud-Latn-ZZ",
        dug: "dug-Latn-ZZ",
        dv: "dv-Thaa-MV",
        dva: "dva-Latn-ZZ",
        dww: "dww-Latn-ZZ",
        dyo: "dyo-Latn-SN",
        dyu: "dyu-Latn-BF",
        dz: "dz-Tibt-BT",
        dzg: "dzg-Latn-ZZ",
        ebu: "ebu-Latn-KE",
        ee: "ee-Latn-GH",
        efi: "efi-Latn-NG",
        egl: "egl-Latn-IT",
        egy: "egy-Egyp-EG",
        eka: "eka-Latn-ZZ",
        eky: "eky-Kali-MM",
        el: "el-Grek-GR",
        ema: "ema-Latn-ZZ",
        emi: "emi-Latn-ZZ",
        en: "en-Latn-US",
        "en-Shaw": "en-Shaw-GB",
        enn: "enn-Latn-ZZ",
        enq: "enq-Latn-ZZ",
        eo: "eo-Latn-001",
        eri: "eri-Latn-ZZ",
        es: "es-Latn-ES",
        esg: "esg-Gonm-IN",
        esu: "esu-Latn-US",
        et: "et-Latn-EE",
        etr: "etr-Latn-ZZ",
        ett: "ett-Ital-IT",
        etu: "etu-Latn-ZZ",
        etx: "etx-Latn-ZZ",
        eu: "eu-Latn-ES",
        ewo: "ewo-Latn-CM",
        ext: "ext-Latn-ES",
        fa: "fa-Arab-IR",
        faa: "faa-Latn-ZZ",
        fab: "fab-Latn-ZZ",
        fag: "fag-Latn-ZZ",
        fai: "fai-Latn-ZZ",
        fan: "fan-Latn-GQ",
        ff: "ff-Latn-SN",
        "ff-Adlm": "ff-Adlm-GN",
        ffi: "ffi-Latn-ZZ",
        ffm: "ffm-Latn-ML",
        fi: "fi-Latn-FI",
        fia: "fia-Arab-SD",
        fil: "fil-Latn-PH",
        fit: "fit-Latn-SE",
        fj: "fj-Latn-FJ",
        flr: "flr-Latn-ZZ",
        fmp: "fmp-Latn-ZZ",
        fo: "fo-Latn-FO",
        fod: "fod-Latn-ZZ",
        fon: "fon-Latn-BJ",
        for: "for-Latn-ZZ",
        fpe: "fpe-Latn-ZZ",
        fqs: "fqs-Latn-ZZ",
        fr: "fr-Latn-FR",
        frc: "frc-Latn-US",
        frp: "frp-Latn-FR",
        frr: "frr-Latn-DE",
        frs: "frs-Latn-DE",
        fub: "fub-Arab-CM",
        fud: "fud-Latn-WF",
        fue: "fue-Latn-ZZ",
        fuf: "fuf-Latn-GN",
        fuh: "fuh-Latn-ZZ",
        fuq: "fuq-Latn-NE",
        fur: "fur-Latn-IT",
        fuv: "fuv-Latn-NG",
        fuy: "fuy-Latn-ZZ",
        fvr: "fvr-Latn-SD",
        fy: "fy-Latn-NL",
        ga: "ga-Latn-IE",
        gaa: "gaa-Latn-GH",
        gaf: "gaf-Latn-ZZ",
        gag: "gag-Latn-MD",
        gah: "gah-Latn-ZZ",
        gaj: "gaj-Latn-ZZ",
        gam: "gam-Latn-ZZ",
        gan: "gan-Hans-CN",
        gaw: "gaw-Latn-ZZ",
        gay: "gay-Latn-ID",
        gba: "gba-Latn-ZZ",
        gbf: "gbf-Latn-ZZ",
        gbm: "gbm-Deva-IN",
        gby: "gby-Latn-ZZ",
        gbz: "gbz-Arab-IR",
        gcr: "gcr-Latn-GF",
        gd: "gd-Latn-GB",
        gde: "gde-Latn-ZZ",
        gdn: "gdn-Latn-ZZ",
        gdr: "gdr-Latn-ZZ",
        geb: "geb-Latn-ZZ",
        gej: "gej-Latn-ZZ",
        gel: "gel-Latn-ZZ",
        gez: "gez-Ethi-ET",
        gfk: "gfk-Latn-ZZ",
        ggn: "ggn-Deva-NP",
        ghs: "ghs-Latn-ZZ",
        gil: "gil-Latn-KI",
        gim: "gim-Latn-ZZ",
        gjk: "gjk-Arab-PK",
        gjn: "gjn-Latn-ZZ",
        gju: "gju-Arab-PK",
        gkn: "gkn-Latn-ZZ",
        gkp: "gkp-Latn-ZZ",
        gl: "gl-Latn-ES",
        glk: "glk-Arab-IR",
        gmm: "gmm-Latn-ZZ",
        gmv: "gmv-Ethi-ZZ",
        gn: "gn-Latn-PY",
        gnd: "gnd-Latn-ZZ",
        gng: "gng-Latn-ZZ",
        god: "god-Latn-ZZ",
        gof: "gof-Ethi-ZZ",
        goi: "goi-Latn-ZZ",
        gom: "gom-Deva-IN",
        gon: "gon-Telu-IN",
        gor: "gor-Latn-ID",
        gos: "gos-Latn-NL",
        got: "got-Goth-UA",
        grb: "grb-Latn-ZZ",
        grc: "grc-Cprt-CY",
        "grc-Linb": "grc-Linb-GR",
        grt: "grt-Beng-IN",
        grw: "grw-Latn-ZZ",
        gsw: "gsw-Latn-CH",
        gu: "gu-Gujr-IN",
        gub: "gub-Latn-BR",
        guc: "guc-Latn-CO",
        gud: "gud-Latn-ZZ",
        gur: "gur-Latn-GH",
        guw: "guw-Latn-ZZ",
        gux: "gux-Latn-ZZ",
        guz: "guz-Latn-KE",
        gv: "gv-Latn-IM",
        gvf: "gvf-Latn-ZZ",
        gvr: "gvr-Deva-NP",
        gvs: "gvs-Latn-ZZ",
        gwc: "gwc-Arab-ZZ",
        gwi: "gwi-Latn-CA",
        gwt: "gwt-Arab-ZZ",
        gyi: "gyi-Latn-ZZ",
        ha: "ha-Latn-NG",
        "ha-CM": "ha-Arab-CM",
        "ha-SD": "ha-Arab-SD",
        hag: "hag-Latn-ZZ",
        hak: "hak-Hans-CN",
        ham: "ham-Latn-ZZ",
        haw: "haw-Latn-US",
        haz: "haz-Arab-AF",
        hbb: "hbb-Latn-ZZ",
        hdy: "hdy-Ethi-ZZ",
        he: "he-Hebr-IL",
        hhy: "hhy-Latn-ZZ",
        hi: "hi-Deva-IN",
        "hi-Latn": "hi-Latn-IN",
        hia: "hia-Latn-ZZ",
        hif: "hif-Latn-FJ",
        hig: "hig-Latn-ZZ",
        hih: "hih-Latn-ZZ",
        hil: "hil-Latn-PH",
        hla: "hla-Latn-ZZ",
        hlu: "hlu-Hluw-TR",
        hmd: "hmd-Plrd-CN",
        hmt: "hmt-Latn-ZZ",
        hnd: "hnd-Arab-PK",
        hne: "hne-Deva-IN",
        hnj: "hnj-Hmng-LA",
        hnn: "hnn-Latn-PH",
        hno: "hno-Arab-PK",
        ho: "ho-Latn-PG",
        hoc: "hoc-Deva-IN",
        hoj: "hoj-Deva-IN",
        hot: "hot-Latn-ZZ",
        hr: "hr-Latn-HR",
        hsb: "hsb-Latn-DE",
        hsn: "hsn-Hans-CN",
        ht: "ht-Latn-HT",
        hu: "hu-Latn-HU",
        hui: "hui-Latn-ZZ",
        hy: "hy-Armn-AM",
        hz: "hz-Latn-NA",
        ia: "ia-Latn-001",
        ian: "ian-Latn-ZZ",
        iar: "iar-Latn-ZZ",
        iba: "iba-Latn-MY",
        ibb: "ibb-Latn-NG",
        iby: "iby-Latn-ZZ",
        ica: "ica-Latn-ZZ",
        ich: "ich-Latn-ZZ",
        id: "id-Latn-ID",
        idd: "idd-Latn-ZZ",
        idi: "idi-Latn-ZZ",
        idu: "idu-Latn-ZZ",
        ife: "ife-Latn-TG",
        ig: "ig-Latn-NG",
        igb: "igb-Latn-ZZ",
        ige: "ige-Latn-ZZ",
        ii: "ii-Yiii-CN",
        ijj: "ijj-Latn-ZZ",
        ik: "ik-Latn-US",
        ikk: "ikk-Latn-ZZ",
        ikt: "ikt-Latn-CA",
        ikw: "ikw-Latn-ZZ",
        ikx: "ikx-Latn-ZZ",
        ilo: "ilo-Latn-PH",
        imo: "imo-Latn-ZZ",
        in: "in-Latn-ID",
        inh: "inh-Cyrl-RU",
        io: "io-Latn-001",
        iou: "iou-Latn-ZZ",
        iri: "iri-Latn-ZZ",
        is: "is-Latn-IS",
        it: "it-Latn-IT",
        iu: "iu-Cans-CA",
        iw: "iw-Hebr-IL",
        iwm: "iwm-Latn-ZZ",
        iws: "iws-Latn-ZZ",
        izh: "izh-Latn-RU",
        izi: "izi-Latn-ZZ",
        ja: "ja-Jpan-JP",
        jab: "jab-Latn-ZZ",
        jam: "jam-Latn-JM",
        jbo: "jbo-Latn-001",
        jbu: "jbu-Latn-ZZ",
        jen: "jen-Latn-ZZ",
        jgk: "jgk-Latn-ZZ",
        jgo: "jgo-Latn-CM",
        ji: "ji-Hebr-UA",
        jib: "jib-Latn-ZZ",
        jmc: "jmc-Latn-TZ",
        jml: "jml-Deva-NP",
        jra: "jra-Latn-ZZ",
        jut: "jut-Latn-DK",
        jv: "jv-Latn-ID",
        jw: "jw-Latn-ID",
        ka: "ka-Geor-GE",
        kaa: "kaa-Cyrl-UZ",
        kab: "kab-Latn-DZ",
        kac: "kac-Latn-MM",
        kad: "kad-Latn-ZZ",
        kai: "kai-Latn-ZZ",
        kaj: "kaj-Latn-NG",
        kam: "kam-Latn-KE",
        kao: "kao-Latn-ML",
        kbd: "kbd-Cyrl-RU",
        kbm: "kbm-Latn-ZZ",
        kbp: "kbp-Latn-ZZ",
        kbq: "kbq-Latn-ZZ",
        kbx: "kbx-Latn-ZZ",
        kby: "kby-Arab-NE",
        kcg: "kcg-Latn-NG",
        kck: "kck-Latn-ZW",
        kcl: "kcl-Latn-ZZ",
        kct: "kct-Latn-ZZ",
        kde: "kde-Latn-TZ",
        kdh: "kdh-Arab-TG",
        kdl: "kdl-Latn-ZZ",
        kdt: "kdt-Thai-TH",
        kea: "kea-Latn-CV",
        ken: "ken-Latn-CM",
        kez: "kez-Latn-ZZ",
        kfo: "kfo-Latn-CI",
        kfr: "kfr-Deva-IN",
        kfy: "kfy-Deva-IN",
        kg: "kg-Latn-CD",
        kge: "kge-Latn-ID",
        kgf: "kgf-Latn-ZZ",
        kgp: "kgp-Latn-BR",
        kha: "kha-Latn-IN",
        khb: "khb-Talu-CN",
        khn: "khn-Deva-IN",
        khq: "khq-Latn-ML",
        khs: "khs-Latn-ZZ",
        kht: "kht-Mymr-IN",
        khw: "khw-Arab-PK",
        khz: "khz-Latn-ZZ",
        ki: "ki-Latn-KE",
        kij: "kij-Latn-ZZ",
        kiu: "kiu-Latn-TR",
        kiw: "kiw-Latn-ZZ",
        kj: "kj-Latn-NA",
        kjd: "kjd-Latn-ZZ",
        kjg: "kjg-Laoo-LA",
        kjs: "kjs-Latn-ZZ",
        kjy: "kjy-Latn-ZZ",
        kk: "kk-Cyrl-KZ",
        "kk-AF": "kk-Arab-AF",
        "kk-Arab": "kk-Arab-CN",
        "kk-CN": "kk-Arab-CN",
        "kk-IR": "kk-Arab-IR",
        "kk-MN": "kk-Arab-MN",
        kkc: "kkc-Latn-ZZ",
        kkj: "kkj-Latn-CM",
        kl: "kl-Latn-GL",
        kln: "kln-Latn-KE",
        klq: "klq-Latn-ZZ",
        klt: "klt-Latn-ZZ",
        klx: "klx-Latn-ZZ",
        km: "km-Khmr-KH",
        kmb: "kmb-Latn-AO",
        kmh: "kmh-Latn-ZZ",
        kmo: "kmo-Latn-ZZ",
        kms: "kms-Latn-ZZ",
        kmu: "kmu-Latn-ZZ",
        kmw: "kmw-Latn-ZZ",
        kn: "kn-Knda-IN",
        knf: "knf-Latn-GW",
        knp: "knp-Latn-ZZ",
        ko: "ko-Kore-KR",
        koi: "koi-Cyrl-RU",
        kok: "kok-Deva-IN",
        kol: "kol-Latn-ZZ",
        kos: "kos-Latn-FM",
        koz: "koz-Latn-ZZ",
        kpe: "kpe-Latn-LR",
        kpf: "kpf-Latn-ZZ",
        kpo: "kpo-Latn-ZZ",
        kpr: "kpr-Latn-ZZ",
        kpx: "kpx-Latn-ZZ",
        kqb: "kqb-Latn-ZZ",
        kqf: "kqf-Latn-ZZ",
        kqs: "kqs-Latn-ZZ",
        kqy: "kqy-Ethi-ZZ",
        kr: "kr-Latn-ZZ",
        krc: "krc-Cyrl-RU",
        kri: "kri-Latn-SL",
        krj: "krj-Latn-PH",
        krl: "krl-Latn-RU",
        krs: "krs-Latn-ZZ",
        kru: "kru-Deva-IN",
        ks: "ks-Arab-IN",
        "ks-Deva": "ks-Deva-IN",
        ksb: "ksb-Latn-TZ",
        ksd: "ksd-Latn-ZZ",
        ksf: "ksf-Latn-CM",
        ksh: "ksh-Latn-DE",
        ksj: "ksj-Latn-ZZ",
        ksr: "ksr-Latn-ZZ",
        ktb: "ktb-Ethi-ZZ",
        ktm: "ktm-Latn-ZZ",
        kto: "kto-Latn-ZZ",
        ktr: "ktr-Latn-MY",
        ku: "ku-Latn-TR",
        "ku-Arab": "ku-Arab-IQ",
        "ku-LB": "ku-Arab-LB",
        "ku-Yezi": "ku-Yezi-GE",
        kub: "kub-Latn-ZZ",
        kud: "kud-Latn-ZZ",
        kue: "kue-Latn-ZZ",
        kuj: "kuj-Latn-ZZ",
        kum: "kum-Cyrl-RU",
        kun: "kun-Latn-ZZ",
        kup: "kup-Latn-ZZ",
        kus: "kus-Latn-ZZ",
        kv: "kv-Cyrl-RU",
        kvg: "kvg-Latn-ZZ",
        kvr: "kvr-Latn-ID",
        kvx: "kvx-Arab-PK",
        kw: "kw-Latn-GB",
        kwj: "kwj-Latn-ZZ",
        kwo: "kwo-Latn-ZZ",
        kwq: "kwq-Latn-ZZ",
        kxa: "kxa-Latn-ZZ",
        kxc: "kxc-Ethi-ZZ",
        kxe: "kxe-Latn-ZZ",
        kxm: "kxm-Thai-TH",
        kxp: "kxp-Arab-PK",
        kxw: "kxw-Latn-ZZ",
        kxz: "kxz-Latn-ZZ",
        ky: "ky-Cyrl-KG",
        "ky-Arab": "ky-Arab-CN",
        "ky-CN": "ky-Arab-CN",
        "ky-Latn": "ky-Latn-TR",
        "ky-TR": "ky-Latn-TR",
        kye: "kye-Latn-ZZ",
        kyx: "kyx-Latn-ZZ",
        kzj: "kzj-Latn-MY",
        kzr: "kzr-Latn-ZZ",
        kzt: "kzt-Latn-MY",
        la: "la-Latn-VA",
        lab: "lab-Lina-GR",
        lad: "lad-Hebr-IL",
        lag: "lag-Latn-TZ",
        lah: "lah-Arab-PK",
        laj: "laj-Latn-UG",
        las: "las-Latn-ZZ",
        lb: "lb-Latn-LU",
        lbe: "lbe-Cyrl-RU",
        lbu: "lbu-Latn-ZZ",
        lbw: "lbw-Latn-ID",
        lcm: "lcm-Latn-ZZ",
        lcp: "lcp-Thai-CN",
        ldb: "ldb-Latn-ZZ",
        led: "led-Latn-ZZ",
        lee: "lee-Latn-ZZ",
        lem: "lem-Latn-ZZ",
        lep: "lep-Lepc-IN",
        leq: "leq-Latn-ZZ",
        leu: "leu-Latn-ZZ",
        lez: "lez-Cyrl-RU",
        lg: "lg-Latn-UG",
        lgg: "lgg-Latn-ZZ",
        li: "li-Latn-NL",
        lia: "lia-Latn-ZZ",
        lid: "lid-Latn-ZZ",
        lif: "lif-Deva-NP",
        "lif-Limb": "lif-Limb-IN",
        lig: "lig-Latn-ZZ",
        lih: "lih-Latn-ZZ",
        lij: "lij-Latn-IT",
        lis: "lis-Lisu-CN",
        ljp: "ljp-Latn-ID",
        lki: "lki-Arab-IR",
        lkt: "lkt-Latn-US",
        lle: "lle-Latn-ZZ",
        lln: "lln-Latn-ZZ",
        lmn: "lmn-Telu-IN",
        lmo: "lmo-Latn-IT",
        lmp: "lmp-Latn-ZZ",
        ln: "ln-Latn-CD",
        lns: "lns-Latn-ZZ",
        lnu: "lnu-Latn-ZZ",
        lo: "lo-Laoo-LA",
        loj: "loj-Latn-ZZ",
        lok: "lok-Latn-ZZ",
        lol: "lol-Latn-CD",
        lor: "lor-Latn-ZZ",
        los: "los-Latn-ZZ",
        loz: "loz-Latn-ZM",
        lrc: "lrc-Arab-IR",
        lt: "lt-Latn-LT",
        ltg: "ltg-Latn-LV",
        lu: "lu-Latn-CD",
        lua: "lua-Latn-CD",
        luo: "luo-Latn-KE",
        luy: "luy-Latn-KE",
        luz: "luz-Arab-IR",
        lv: "lv-Latn-LV",
        lwl: "lwl-Thai-TH",
        lzh: "lzh-Hans-CN",
        lzz: "lzz-Latn-TR",
        mad: "mad-Latn-ID",
        maf: "maf-Latn-CM",
        mag: "mag-Deva-IN",
        mai: "mai-Deva-IN",
        mak: "mak-Latn-ID",
        man: "man-Latn-GM",
        "man-GN": "man-Nkoo-GN",
        "man-Nkoo": "man-Nkoo-GN",
        mas: "mas-Latn-KE",
        maw: "maw-Latn-ZZ",
        maz: "maz-Latn-MX",
        mbh: "mbh-Latn-ZZ",
        mbo: "mbo-Latn-ZZ",
        mbq: "mbq-Latn-ZZ",
        mbu: "mbu-Latn-ZZ",
        mbw: "mbw-Latn-ZZ",
        mci: "mci-Latn-ZZ",
        mcp: "mcp-Latn-ZZ",
        mcq: "mcq-Latn-ZZ",
        mcr: "mcr-Latn-ZZ",
        mcu: "mcu-Latn-ZZ",
        mda: "mda-Latn-ZZ",
        mde: "mde-Arab-ZZ",
        mdf: "mdf-Cyrl-RU",
        mdh: "mdh-Latn-PH",
        mdj: "mdj-Latn-ZZ",
        mdr: "mdr-Latn-ID",
        mdx: "mdx-Ethi-ZZ",
        med: "med-Latn-ZZ",
        mee: "mee-Latn-ZZ",
        mek: "mek-Latn-ZZ",
        men: "men-Latn-SL",
        mer: "mer-Latn-KE",
        met: "met-Latn-ZZ",
        meu: "meu-Latn-ZZ",
        mfa: "mfa-Arab-TH",
        mfe: "mfe-Latn-MU",
        mfn: "mfn-Latn-ZZ",
        mfo: "mfo-Latn-ZZ",
        mfq: "mfq-Latn-ZZ",
        mg: "mg-Latn-MG",
        mgh: "mgh-Latn-MZ",
        mgl: "mgl-Latn-ZZ",
        mgo: "mgo-Latn-CM",
        mgp: "mgp-Deva-NP",
        mgy: "mgy-Latn-TZ",
        mh: "mh-Latn-MH",
        mhi: "mhi-Latn-ZZ",
        mhl: "mhl-Latn-ZZ",
        mi: "mi-Latn-NZ",
        mif: "mif-Latn-ZZ",
        min: "min-Latn-ID",
        mis: "mis-Hatr-IQ",
        "mis-Medf": "mis-Medf-NG",
        miw: "miw-Latn-ZZ",
        mk: "mk-Cyrl-MK",
        mki: "mki-Arab-ZZ",
        mkl: "mkl-Latn-ZZ",
        mkp: "mkp-Latn-ZZ",
        mkw: "mkw-Latn-ZZ",
        ml: "ml-Mlym-IN",
        mle: "mle-Latn-ZZ",
        mlp: "mlp-Latn-ZZ",
        mls: "mls-Latn-SD",
        mmo: "mmo-Latn-ZZ",
        mmu: "mmu-Latn-ZZ",
        mmx: "mmx-Latn-ZZ",
        mn: "mn-Cyrl-MN",
        "mn-CN": "mn-Mong-CN",
        "mn-Mong": "mn-Mong-CN",
        mna: "mna-Latn-ZZ",
        mnf: "mnf-Latn-ZZ",
        mni: "mni-Beng-IN",
        mnw: "mnw-Mymr-MM",
        mo: "mo-Latn-RO",
        moa: "moa-Latn-ZZ",
        moe: "moe-Latn-CA",
        moh: "moh-Latn-CA",
        mos: "mos-Latn-BF",
        mox: "mox-Latn-ZZ",
        mpp: "mpp-Latn-ZZ",
        mps: "mps-Latn-ZZ",
        mpt: "mpt-Latn-ZZ",
        mpx: "mpx-Latn-ZZ",
        mql: "mql-Latn-ZZ",
        mr: "mr-Deva-IN",
        mrd: "mrd-Deva-NP",
        mrj: "mrj-Cyrl-RU",
        mro: "mro-Mroo-BD",
        ms: "ms-Latn-MY",
        "ms-CC": "ms-Arab-CC",
        "ms-ID": "ms-Latn-ID",
        mt: "mt-Latn-MT",
        mtc: "mtc-Latn-ZZ",
        mtf: "mtf-Latn-ZZ",
        mti: "mti-Latn-ZZ",
        mtr: "mtr-Deva-IN",
        mua: "mua-Latn-CM",
        mur: "mur-Latn-ZZ",
        mus: "mus-Latn-US",
        mva: "mva-Latn-ZZ",
        mvn: "mvn-Latn-ZZ",
        mvy: "mvy-Arab-PK",
        mwk: "mwk-Latn-ML",
        mwr: "mwr-Deva-IN",
        mwv: "mwv-Latn-ID",
        mww: "mww-Hmnp-US",
        mxc: "mxc-Latn-ZW",
        mxm: "mxm-Latn-ZZ",
        my: "my-Mymr-MM",
        myk: "myk-Latn-ZZ",
        mym: "mym-Ethi-ZZ",
        myv: "myv-Cyrl-RU",
        myw: "myw-Latn-ZZ",
        myx: "myx-Latn-UG",
        myz: "myz-Mand-IR",
        mzk: "mzk-Latn-ZZ",
        mzm: "mzm-Latn-ZZ",
        mzn: "mzn-Arab-IR",
        mzp: "mzp-Latn-ZZ",
        mzw: "mzw-Latn-ZZ",
        mzz: "mzz-Latn-ZZ",
        na: "na-Latn-NR",
        nac: "nac-Latn-ZZ",
        naf: "naf-Latn-ZZ",
        nak: "nak-Latn-ZZ",
        nan: "nan-Hans-CN",
        nap: "nap-Latn-IT",
        naq: "naq-Latn-NA",
        nas: "nas-Latn-ZZ",
        nb: "nb-Latn-NO",
        nca: "nca-Latn-ZZ",
        nce: "nce-Latn-ZZ",
        ncf: "ncf-Latn-ZZ",
        nch: "nch-Latn-MX",
        nco: "nco-Latn-ZZ",
        ncu: "ncu-Latn-ZZ",
        nd: "nd-Latn-ZW",
        ndc: "ndc-Latn-MZ",
        nds: "nds-Latn-DE",
        ne: "ne-Deva-NP",
        neb: "neb-Latn-ZZ",
        new: "new-Deva-NP",
        nex: "nex-Latn-ZZ",
        nfr: "nfr-Latn-ZZ",
        ng: "ng-Latn-NA",
        nga: "nga-Latn-ZZ",
        ngb: "ngb-Latn-ZZ",
        ngl: "ngl-Latn-MZ",
        nhb: "nhb-Latn-ZZ",
        nhe: "nhe-Latn-MX",
        nhw: "nhw-Latn-MX",
        nif: "nif-Latn-ZZ",
        nii: "nii-Latn-ZZ",
        nij: "nij-Latn-ID",
        nin: "nin-Latn-ZZ",
        niu: "niu-Latn-NU",
        niy: "niy-Latn-ZZ",
        niz: "niz-Latn-ZZ",
        njo: "njo-Latn-IN",
        nkg: "nkg-Latn-ZZ",
        nko: "nko-Latn-ZZ",
        nl: "nl-Latn-NL",
        nmg: "nmg-Latn-CM",
        nmz: "nmz-Latn-ZZ",
        nn: "nn-Latn-NO",
        nnf: "nnf-Latn-ZZ",
        nnh: "nnh-Latn-CM",
        nnk: "nnk-Latn-ZZ",
        nnm: "nnm-Latn-ZZ",
        nnp: "nnp-Wcho-IN",
        no: "no-Latn-NO",
        nod: "nod-Lana-TH",
        noe: "noe-Deva-IN",
        non: "non-Runr-SE",
        nop: "nop-Latn-ZZ",
        nou: "nou-Latn-ZZ",
        nqo: "nqo-Nkoo-GN",
        nr: "nr-Latn-ZA",
        nrb: "nrb-Latn-ZZ",
        nsk: "nsk-Cans-CA",
        nsn: "nsn-Latn-ZZ",
        nso: "nso-Latn-ZA",
        nss: "nss-Latn-ZZ",
        ntm: "ntm-Latn-ZZ",
        ntr: "ntr-Latn-ZZ",
        nui: "nui-Latn-ZZ",
        nup: "nup-Latn-ZZ",
        nus: "nus-Latn-SS",
        nuv: "nuv-Latn-ZZ",
        nux: "nux-Latn-ZZ",
        nv: "nv-Latn-US",
        nwb: "nwb-Latn-ZZ",
        nxq: "nxq-Latn-CN",
        nxr: "nxr-Latn-ZZ",
        ny: "ny-Latn-MW",
        nym: "nym-Latn-TZ",
        nyn: "nyn-Latn-UG",
        nzi: "nzi-Latn-GH",
        oc: "oc-Latn-FR",
        ogc: "ogc-Latn-ZZ",
        okr: "okr-Latn-ZZ",
        okv: "okv-Latn-ZZ",
        om: "om-Latn-ET",
        ong: "ong-Latn-ZZ",
        onn: "onn-Latn-ZZ",
        ons: "ons-Latn-ZZ",
        opm: "opm-Latn-ZZ",
        or: "or-Orya-IN",
        oro: "oro-Latn-ZZ",
        oru: "oru-Arab-ZZ",
        os: "os-Cyrl-GE",
        osa: "osa-Osge-US",
        ota: "ota-Arab-ZZ",
        otk: "otk-Orkh-MN",
        ozm: "ozm-Latn-ZZ",
        pa: "pa-Guru-IN",
        "pa-Arab": "pa-Arab-PK",
        "pa-PK": "pa-Arab-PK",
        pag: "pag-Latn-PH",
        pal: "pal-Phli-IR",
        "pal-Phlp": "pal-Phlp-CN",
        pam: "pam-Latn-PH",
        pap: "pap-Latn-AW",
        pau: "pau-Latn-PW",
        pbi: "pbi-Latn-ZZ",
        pcd: "pcd-Latn-FR",
        pcm: "pcm-Latn-NG",
        pdc: "pdc-Latn-US",
        pdt: "pdt-Latn-CA",
        ped: "ped-Latn-ZZ",
        peo: "peo-Xpeo-IR",
        pex: "pex-Latn-ZZ",
        pfl: "pfl-Latn-DE",
        phl: "phl-Arab-ZZ",
        phn: "phn-Phnx-LB",
        pil: "pil-Latn-ZZ",
        pip: "pip-Latn-ZZ",
        pka: "pka-Brah-IN",
        pko: "pko-Latn-KE",
        pl: "pl-Latn-PL",
        pla: "pla-Latn-ZZ",
        pms: "pms-Latn-IT",
        png: "png-Latn-ZZ",
        pnn: "pnn-Latn-ZZ",
        pnt: "pnt-Grek-GR",
        pon: "pon-Latn-FM",
        ppa: "ppa-Deva-IN",
        ppo: "ppo-Latn-ZZ",
        pra: "pra-Khar-PK",
        prd: "prd-Arab-IR",
        prg: "prg-Latn-001",
        ps: "ps-Arab-AF",
        pss: "pss-Latn-ZZ",
        pt: "pt-Latn-BR",
        ptp: "ptp-Latn-ZZ",
        puu: "puu-Latn-GA",
        pwa: "pwa-Latn-ZZ",
        qu: "qu-Latn-PE",
        quc: "quc-Latn-GT",
        qug: "qug-Latn-EC",
        rai: "rai-Latn-ZZ",
        raj: "raj-Deva-IN",
        rao: "rao-Latn-ZZ",
        rcf: "rcf-Latn-RE",
        rej: "rej-Latn-ID",
        rel: "rel-Latn-ZZ",
        res: "res-Latn-ZZ",
        rgn: "rgn-Latn-IT",
        rhg: "rhg-Arab-MM",
        ria: "ria-Latn-IN",
        rif: "rif-Tfng-MA",
        "rif-NL": "rif-Latn-NL",
        rjs: "rjs-Deva-NP",
        rkt: "rkt-Beng-BD",
        rm: "rm-Latn-CH",
        rmf: "rmf-Latn-FI",
        rmo: "rmo-Latn-CH",
        rmt: "rmt-Arab-IR",
        rmu: "rmu-Latn-SE",
        rn: "rn-Latn-BI",
        rna: "rna-Latn-ZZ",
        rng: "rng-Latn-MZ",
        ro: "ro-Latn-RO",
        rob: "rob-Latn-ID",
        rof: "rof-Latn-TZ",
        roo: "roo-Latn-ZZ",
        rro: "rro-Latn-ZZ",
        rtm: "rtm-Latn-FJ",
        ru: "ru-Cyrl-RU",
        rue: "rue-Cyrl-UA",
        rug: "rug-Latn-SB",
        rw: "rw-Latn-RW",
        rwk: "rwk-Latn-TZ",
        rwo: "rwo-Latn-ZZ",
        ryu: "ryu-Kana-JP",
        sa: "sa-Deva-IN",
        saf: "saf-Latn-GH",
        sah: "sah-Cyrl-RU",
        saq: "saq-Latn-KE",
        sas: "sas-Latn-ID",
        sat: "sat-Olck-IN",
        sav: "sav-Latn-SN",
        saz: "saz-Saur-IN",
        sba: "sba-Latn-ZZ",
        sbe: "sbe-Latn-ZZ",
        sbp: "sbp-Latn-TZ",
        sc: "sc-Latn-IT",
        sck: "sck-Deva-IN",
        scl: "scl-Arab-ZZ",
        scn: "scn-Latn-IT",
        sco: "sco-Latn-GB",
        scs: "scs-Latn-CA",
        sd: "sd-Arab-PK",
        "sd-Deva": "sd-Deva-IN",
        "sd-Khoj": "sd-Khoj-IN",
        "sd-Sind": "sd-Sind-IN",
        sdc: "sdc-Latn-IT",
        sdh: "sdh-Arab-IR",
        se: "se-Latn-NO",
        sef: "sef-Latn-CI",
        seh: "seh-Latn-MZ",
        sei: "sei-Latn-MX",
        ses: "ses-Latn-ML",
        sg: "sg-Latn-CF",
        sga: "sga-Ogam-IE",
        sgs: "sgs-Latn-LT",
        sgw: "sgw-Ethi-ZZ",
        sgz: "sgz-Latn-ZZ",
        shi: "shi-Tfng-MA",
        shk: "shk-Latn-ZZ",
        shn: "shn-Mymr-MM",
        shu: "shu-Arab-ZZ",
        si: "si-Sinh-LK",
        sid: "sid-Latn-ET",
        sig: "sig-Latn-ZZ",
        sil: "sil-Latn-ZZ",
        sim: "sim-Latn-ZZ",
        sjr: "sjr-Latn-ZZ",
        sk: "sk-Latn-SK",
        skc: "skc-Latn-ZZ",
        skr: "skr-Arab-PK",
        sks: "sks-Latn-ZZ",
        sl: "sl-Latn-SI",
        sld: "sld-Latn-ZZ",
        sli: "sli-Latn-PL",
        sll: "sll-Latn-ZZ",
        sly: "sly-Latn-ID",
        sm: "sm-Latn-WS",
        sma: "sma-Latn-SE",
        smj: "smj-Latn-SE",
        smn: "smn-Latn-FI",
        smp: "smp-Samr-IL",
        smq: "smq-Latn-ZZ",
        sms: "sms-Latn-FI",
        sn: "sn-Latn-ZW",
        snc: "snc-Latn-ZZ",
        snk: "snk-Latn-ML",
        snp: "snp-Latn-ZZ",
        snx: "snx-Latn-ZZ",
        sny: "sny-Latn-ZZ",
        so: "so-Latn-SO",
        sog: "sog-Sogd-UZ",
        sok: "sok-Latn-ZZ",
        soq: "soq-Latn-ZZ",
        sou: "sou-Thai-TH",
        soy: "soy-Latn-ZZ",
        spd: "spd-Latn-ZZ",
        spl: "spl-Latn-ZZ",
        sps: "sps-Latn-ZZ",
        sq: "sq-Latn-AL",
        sr: "sr-Cyrl-RS",
        "sr-ME": "sr-Latn-ME",
        "sr-RO": "sr-Latn-RO",
        "sr-RU": "sr-Latn-RU",
        "sr-TR": "sr-Latn-TR",
        srb: "srb-Sora-IN",
        srn: "srn-Latn-SR",
        srr: "srr-Latn-SN",
        srx: "srx-Deva-IN",
        ss: "ss-Latn-ZA",
        ssd: "ssd-Latn-ZZ",
        ssg: "ssg-Latn-ZZ",
        ssy: "ssy-Latn-ER",
        st: "st-Latn-ZA",
        stk: "stk-Latn-ZZ",
        stq: "stq-Latn-DE",
        su: "su-Latn-ID",
        sua: "sua-Latn-ZZ",
        sue: "sue-Latn-ZZ",
        suk: "suk-Latn-TZ",
        sur: "sur-Latn-ZZ",
        sus: "sus-Latn-GN",
        sv: "sv-Latn-SE",
        sw: "sw-Latn-TZ",
        swb: "swb-Arab-YT",
        swc: "swc-Latn-CD",
        swg: "swg-Latn-DE",
        swp: "swp-Latn-ZZ",
        swv: "swv-Deva-IN",
        sxn: "sxn-Latn-ID",
        sxw: "sxw-Latn-ZZ",
        syl: "syl-Beng-BD",
        syr: "syr-Syrc-IQ",
        szl: "szl-Latn-PL",
        ta: "ta-Taml-IN",
        taj: "taj-Deva-NP",
        tal: "tal-Latn-ZZ",
        tan: "tan-Latn-ZZ",
        taq: "taq-Latn-ZZ",
        tbc: "tbc-Latn-ZZ",
        tbd: "tbd-Latn-ZZ",
        tbf: "tbf-Latn-ZZ",
        tbg: "tbg-Latn-ZZ",
        tbo: "tbo-Latn-ZZ",
        tbw: "tbw-Latn-PH",
        tbz: "tbz-Latn-ZZ",
        tci: "tci-Latn-ZZ",
        tcy: "tcy-Knda-IN",
        tdd: "tdd-Tale-CN",
        tdg: "tdg-Deva-NP",
        tdh: "tdh-Deva-NP",
        tdu: "tdu-Latn-MY",
        te: "te-Telu-IN",
        ted: "ted-Latn-ZZ",
        tem: "tem-Latn-SL",
        teo: "teo-Latn-UG",
        tet: "tet-Latn-TL",
        tfi: "tfi-Latn-ZZ",
        tg: "tg-Cyrl-TJ",
        "tg-Arab": "tg-Arab-PK",
        "tg-PK": "tg-Arab-PK",
        tgc: "tgc-Latn-ZZ",
        tgo: "tgo-Latn-ZZ",
        tgu: "tgu-Latn-ZZ",
        th: "th-Thai-TH",
        thl: "thl-Deva-NP",
        thq: "thq-Deva-NP",
        thr: "thr-Deva-NP",
        ti: "ti-Ethi-ET",
        tif: "tif-Latn-ZZ",
        tig: "tig-Ethi-ER",
        tik: "tik-Latn-ZZ",
        tim: "tim-Latn-ZZ",
        tio: "tio-Latn-ZZ",
        tiv: "tiv-Latn-NG",
        tk: "tk-Latn-TM",
        tkl: "tkl-Latn-TK",
        tkr: "tkr-Latn-AZ",
        tkt: "tkt-Deva-NP",
        tl: "tl-Latn-PH",
        tlf: "tlf-Latn-ZZ",
        tlx: "tlx-Latn-ZZ",
        tly: "tly-Latn-AZ",
        tmh: "tmh-Latn-NE",
        tmy: "tmy-Latn-ZZ",
        tn: "tn-Latn-ZA",
        tnh: "tnh-Latn-ZZ",
        to: "to-Latn-TO",
        tof: "tof-Latn-ZZ",
        tog: "tog-Latn-MW",
        toq: "toq-Latn-ZZ",
        tpi: "tpi-Latn-PG",
        tpm: "tpm-Latn-ZZ",
        tpz: "tpz-Latn-ZZ",
        tqo: "tqo-Latn-ZZ",
        tr: "tr-Latn-TR",
        tru: "tru-Latn-TR",
        trv: "trv-Latn-TW",
        trw: "trw-Arab-ZZ",
        ts: "ts-Latn-ZA",
        tsd: "tsd-Grek-GR",
        tsf: "tsf-Deva-NP",
        tsg: "tsg-Latn-PH",
        tsj: "tsj-Tibt-BT",
        tsw: "tsw-Latn-ZZ",
        tt: "tt-Cyrl-RU",
        ttd: "ttd-Latn-ZZ",
        tte: "tte-Latn-ZZ",
        ttj: "ttj-Latn-UG",
        ttr: "ttr-Latn-ZZ",
        tts: "tts-Thai-TH",
        ttt: "ttt-Latn-AZ",
        tuh: "tuh-Latn-ZZ",
        tul: "tul-Latn-ZZ",
        tum: "tum-Latn-MW",
        tuq: "tuq-Latn-ZZ",
        tvd: "tvd-Latn-ZZ",
        tvl: "tvl-Latn-TV",
        tvu: "tvu-Latn-ZZ",
        twh: "twh-Latn-ZZ",
        twq: "twq-Latn-NE",
        txg: "txg-Tang-CN",
        ty: "ty-Latn-PF",
        tya: "tya-Latn-ZZ",
        tyv: "tyv-Cyrl-RU",
        tzm: "tzm-Latn-MA",
        ubu: "ubu-Latn-ZZ",
        udm: "udm-Cyrl-RU",
        ug: "ug-Arab-CN",
        "ug-Cyrl": "ug-Cyrl-KZ",
        "ug-KZ": "ug-Cyrl-KZ",
        "ug-MN": "ug-Cyrl-MN",
        uga: "uga-Ugar-SY",
        uk: "uk-Cyrl-UA",
        uli: "uli-Latn-FM",
        umb: "umb-Latn-AO",
        und: "en-Latn-US",
        "und-002": "en-Latn-NG",
        "und-003": "en-Latn-US",
        "und-005": "pt-Latn-BR",
        "und-009": "en-Latn-AU",
        "und-011": "en-Latn-NG",
        "und-013": "es-Latn-MX",
        "und-014": "sw-Latn-TZ",
        "und-015": "ar-Arab-EG",
        "und-017": "sw-Latn-CD",
        "und-018": "en-Latn-ZA",
        "und-019": "en-Latn-US",
        "und-021": "en-Latn-US",
        "und-029": "es-Latn-CU",
        "und-030": "zh-Hans-CN",
        "und-034": "hi-Deva-IN",
        "und-035": "id-Latn-ID",
        "und-039": "it-Latn-IT",
        "und-053": "en-Latn-AU",
        "und-054": "en-Latn-PG",
        "und-057": "en-Latn-GU",
        "und-061": "sm-Latn-WS",
        "und-142": "zh-Hans-CN",
        "und-143": "uz-Latn-UZ",
        "und-145": "ar-Arab-SA",
        "und-150": "ru-Cyrl-RU",
        "und-151": "ru-Cyrl-RU",
        "und-154": "en-Latn-GB",
        "und-155": "de-Latn-DE",
        "und-202": "en-Latn-NG",
        "und-419": "es-Latn-419",
        "und-AD": "ca-Latn-AD",
        "und-Adlm": "ff-Adlm-GN",
        "und-AE": "ar-Arab-AE",
        "und-AF": "fa-Arab-AF",
        "und-Aghb": "lez-Aghb-RU",
        "und-Ahom": "aho-Ahom-IN",
        "und-AL": "sq-Latn-AL",
        "und-AM": "hy-Armn-AM",
        "und-AO": "pt-Latn-AO",
        "und-AQ": "und-Latn-AQ",
        "und-AR": "es-Latn-AR",
        "und-Arab": "ar-Arab-EG",
        "und-Arab-CC": "ms-Arab-CC",
        "und-Arab-CN": "ug-Arab-CN",
        "und-Arab-GB": "ks-Arab-GB",
        "und-Arab-ID": "ms-Arab-ID",
        "und-Arab-IN": "ur-Arab-IN",
        "und-Arab-KH": "cja-Arab-KH",
        "und-Arab-MM": "rhg-Arab-MM",
        "und-Arab-MN": "kk-Arab-MN",
        "und-Arab-MU": "ur-Arab-MU",
        "und-Arab-NG": "ha-Arab-NG",
        "und-Arab-PK": "ur-Arab-PK",
        "und-Arab-TG": "apd-Arab-TG",
        "und-Arab-TH": "mfa-Arab-TH",
        "und-Arab-TJ": "fa-Arab-TJ",
        "und-Arab-TR": "az-Arab-TR",
        "und-Arab-YT": "swb-Arab-YT",
        "und-Armi": "arc-Armi-IR",
        "und-Armn": "hy-Armn-AM",
        "und-AS": "sm-Latn-AS",
        "und-AT": "de-Latn-AT",
        "und-Avst": "ae-Avst-IR",
        "und-AW": "nl-Latn-AW",
        "und-AX": "sv-Latn-AX",
        "und-AZ": "az-Latn-AZ",
        "und-BA": "bs-Latn-BA",
        "und-Bali": "ban-Bali-ID",
        "und-Bamu": "bax-Bamu-CM",
        "und-Bass": "bsq-Bass-LR",
        "und-Batk": "bbc-Batk-ID",
        "und-BD": "bn-Beng-BD",
        "und-BE": "nl-Latn-BE",
        "und-Beng": "bn-Beng-BD",
        "und-BF": "fr-Latn-BF",
        "und-BG": "bg-Cyrl-BG",
        "und-BH": "ar-Arab-BH",
        "und-Bhks": "sa-Bhks-IN",
        "und-BI": "rn-Latn-BI",
        "und-BJ": "fr-Latn-BJ",
        "und-BL": "fr-Latn-BL",
        "und-BN": "ms-Latn-BN",
        "und-BO": "es-Latn-BO",
        "und-Bopo": "zh-Bopo-TW",
        "und-BQ": "pap-Latn-BQ",
        "und-BR": "pt-Latn-BR",
        "und-Brah": "pka-Brah-IN",
        "und-Brai": "fr-Brai-FR",
        "und-BT": "dz-Tibt-BT",
        "und-Bugi": "bug-Bugi-ID",
        "und-Buhd": "bku-Buhd-PH",
        "und-BV": "und-Latn-BV",
        "und-BY": "be-Cyrl-BY",
        "und-Cakm": "ccp-Cakm-BD",
        "und-Cans": "cr-Cans-CA",
        "und-Cari": "xcr-Cari-TR",
        "und-CD": "sw-Latn-CD",
        "und-CF": "fr-Latn-CF",
        "und-CG": "fr-Latn-CG",
        "und-CH": "de-Latn-CH",
        "und-Cham": "cjm-Cham-VN",
        "und-Cher": "chr-Cher-US",
        "und-Chrs": "xco-Chrs-UZ",
        "und-CI": "fr-Latn-CI",
        "und-CL": "es-Latn-CL",
        "und-CM": "fr-Latn-CM",
        "und-CN": "zh-Hans-CN",
        "und-CO": "es-Latn-CO",
        "und-Copt": "cop-Copt-EG",
        "und-CP": "und-Latn-CP",
        "und-Cprt": "grc-Cprt-CY",
        "und-CR": "es-Latn-CR",
        "und-CU": "es-Latn-CU",
        "und-CV": "pt-Latn-CV",
        "und-CW": "pap-Latn-CW",
        "und-CY": "el-Grek-CY",
        "und-Cyrl": "ru-Cyrl-RU",
        "und-Cyrl-AL": "mk-Cyrl-AL",
        "und-Cyrl-BA": "sr-Cyrl-BA",
        "und-Cyrl-GE": "ab-Cyrl-GE",
        "und-Cyrl-GR": "mk-Cyrl-GR",
        "und-Cyrl-MD": "uk-Cyrl-MD",
        "und-Cyrl-RO": "bg-Cyrl-RO",
        "und-Cyrl-SK": "uk-Cyrl-SK",
        "und-Cyrl-TR": "kbd-Cyrl-TR",
        "und-Cyrl-XK": "sr-Cyrl-XK",
        "und-CZ": "cs-Latn-CZ",
        "und-DE": "de-Latn-DE",
        "und-Deva": "hi-Deva-IN",
        "und-Deva-BT": "ne-Deva-BT",
        "und-Deva-FJ": "hif-Deva-FJ",
        "und-Deva-MU": "bho-Deva-MU",
        "und-Deva-PK": "btv-Deva-PK",
        "und-Diak": "dv-Diak-MV",
        "und-DJ": "aa-Latn-DJ",
        "und-DK": "da-Latn-DK",
        "und-DO": "es-Latn-DO",
        "und-Dogr": "doi-Dogr-IN",
        "und-Dupl": "fr-Dupl-FR",
        "und-DZ": "ar-Arab-DZ",
        "und-EA": "es-Latn-EA",
        "und-EC": "es-Latn-EC",
        "und-EE": "et-Latn-EE",
        "und-EG": "ar-Arab-EG",
        "und-Egyp": "egy-Egyp-EG",
        "und-EH": "ar-Arab-EH",
        "und-Elba": "sq-Elba-AL",
        "und-Elym": "arc-Elym-IR",
        "und-ER": "ti-Ethi-ER",
        "und-ES": "es-Latn-ES",
        "und-ET": "am-Ethi-ET",
        "und-Ethi": "am-Ethi-ET",
        "und-EU": "en-Latn-GB",
        "und-EZ": "de-Latn-EZ",
        "und-FI": "fi-Latn-FI",
        "und-FO": "fo-Latn-FO",
        "und-FR": "fr-Latn-FR",
        "und-GA": "fr-Latn-GA",
        "und-GE": "ka-Geor-GE",
        "und-Geor": "ka-Geor-GE",
        "und-GF": "fr-Latn-GF",
        "und-GH": "ak-Latn-GH",
        "und-GL": "kl-Latn-GL",
        "und-Glag": "cu-Glag-BG",
        "und-GN": "fr-Latn-GN",
        "und-Gong": "wsg-Gong-IN",
        "und-Gonm": "esg-Gonm-IN",
        "und-Goth": "got-Goth-UA",
        "und-GP": "fr-Latn-GP",
        "und-GQ": "es-Latn-GQ",
        "und-GR": "el-Grek-GR",
        "und-Gran": "sa-Gran-IN",
        "und-Grek": "el-Grek-GR",
        "und-Grek-TR": "bgx-Grek-TR",
        "und-GS": "und-Latn-GS",
        "und-GT": "es-Latn-GT",
        "und-Gujr": "gu-Gujr-IN",
        "und-Guru": "pa-Guru-IN",
        "und-GW": "pt-Latn-GW",
        "und-Hanb": "zh-Hanb-TW",
        "und-Hang": "ko-Hang-KR",
        "und-Hani": "zh-Hani-CN",
        "und-Hano": "hnn-Hano-PH",
        "und-Hans": "zh-Hans-CN",
        "und-Hant": "zh-Hant-TW",
        "und-Hatr": "mis-Hatr-IQ",
        "und-Hebr": "he-Hebr-IL",
        "und-Hebr-CA": "yi-Hebr-CA",
        "und-Hebr-GB": "yi-Hebr-GB",
        "und-Hebr-SE": "yi-Hebr-SE",
        "und-Hebr-UA": "yi-Hebr-UA",
        "und-Hebr-US": "yi-Hebr-US",
        "und-Hira": "ja-Hira-JP",
        "und-HK": "zh-Hant-HK",
        "und-Hluw": "hlu-Hluw-TR",
        "und-HM": "und-Latn-HM",
        "und-Hmng": "hnj-Hmng-LA",
        "und-Hmnp": "mww-Hmnp-US",
        "und-HN": "es-Latn-HN",
        "und-HR": "hr-Latn-HR",
        "und-HT": "ht-Latn-HT",
        "und-HU": "hu-Latn-HU",
        "und-Hung": "hu-Hung-HU",
        "und-IC": "es-Latn-IC",
        "und-ID": "id-Latn-ID",
        "und-IL": "he-Hebr-IL",
        "und-IN": "hi-Deva-IN",
        "und-IQ": "ar-Arab-IQ",
        "und-IR": "fa-Arab-IR",
        "und-IS": "is-Latn-IS",
        "und-IT": "it-Latn-IT",
        "und-Ital": "ett-Ital-IT",
        "und-Jamo": "ko-Jamo-KR",
        "und-Java": "jv-Java-ID",
        "und-JO": "ar-Arab-JO",
        "und-JP": "ja-Jpan-JP",
        "und-Jpan": "ja-Jpan-JP",
        "und-Kali": "eky-Kali-MM",
        "und-Kana": "ja-Kana-JP",
        "und-KE": "sw-Latn-KE",
        "und-KG": "ky-Cyrl-KG",
        "und-KH": "km-Khmr-KH",
        "und-Khar": "pra-Khar-PK",
        "und-Khmr": "km-Khmr-KH",
        "und-Khoj": "sd-Khoj-IN",
        "und-Kits": "zkt-Kits-CN",
        "und-KM": "ar-Arab-KM",
        "und-Knda": "kn-Knda-IN",
        "und-Kore": "ko-Kore-KR",
        "und-KP": "ko-Kore-KP",
        "und-KR": "ko-Kore-KR",
        "und-Kthi": "bho-Kthi-IN",
        "und-KW": "ar-Arab-KW",
        "und-KZ": "ru-Cyrl-KZ",
        "und-LA": "lo-Laoo-LA",
        "und-Lana": "nod-Lana-TH",
        "und-Laoo": "lo-Laoo-LA",
        "und-Latn-AF": "tk-Latn-AF",
        "und-Latn-AM": "ku-Latn-AM",
        "und-Latn-CN": "za-Latn-CN",
        "und-Latn-CY": "tr-Latn-CY",
        "und-Latn-DZ": "fr-Latn-DZ",
        "und-Latn-ET": "en-Latn-ET",
        "und-Latn-GE": "ku-Latn-GE",
        "und-Latn-IR": "tk-Latn-IR",
        "und-Latn-KM": "fr-Latn-KM",
        "und-Latn-MA": "fr-Latn-MA",
        "und-Latn-MK": "sq-Latn-MK",
        "und-Latn-MM": "kac-Latn-MM",
        "und-Latn-MO": "pt-Latn-MO",
        "und-Latn-MR": "fr-Latn-MR",
        "und-Latn-RU": "krl-Latn-RU",
        "und-Latn-SY": "fr-Latn-SY",
        "und-Latn-TN": "fr-Latn-TN",
        "und-Latn-TW": "trv-Latn-TW",
        "und-Latn-UA": "pl-Latn-UA",
        "und-LB": "ar-Arab-LB",
        "und-Lepc": "lep-Lepc-IN",
        "und-LI": "de-Latn-LI",
        "und-Limb": "lif-Limb-IN",
        "und-Lina": "lab-Lina-GR",
        "und-Linb": "grc-Linb-GR",
        "und-Lisu": "lis-Lisu-CN",
        "und-LK": "si-Sinh-LK",
        "und-LS": "st-Latn-LS",
        "und-LT": "lt-Latn-LT",
        "und-LU": "fr-Latn-LU",
        "und-LV": "lv-Latn-LV",
        "und-LY": "ar-Arab-LY",
        "und-Lyci": "xlc-Lyci-TR",
        "und-Lydi": "xld-Lydi-TR",
        "und-MA": "ar-Arab-MA",
        "und-Mahj": "hi-Mahj-IN",
        "und-Maka": "mak-Maka-ID",
        "und-Mand": "myz-Mand-IR",
        "und-Mani": "xmn-Mani-CN",
        "und-Marc": "bo-Marc-CN",
        "und-MC": "fr-Latn-MC",
        "und-MD": "ro-Latn-MD",
        "und-ME": "sr-Latn-ME",
        "und-Medf": "mis-Medf-NG",
        "und-Mend": "men-Mend-SL",
        "und-Merc": "xmr-Merc-SD",
        "und-Mero": "xmr-Mero-SD",
        "und-MF": "fr-Latn-MF",
        "und-MG": "mg-Latn-MG",
        "und-MK": "mk-Cyrl-MK",
        "und-ML": "bm-Latn-ML",
        "und-Mlym": "ml-Mlym-IN",
        "und-MM": "my-Mymr-MM",
        "und-MN": "mn-Cyrl-MN",
        "und-MO": "zh-Hant-MO",
        "und-Modi": "mr-Modi-IN",
        "und-Mong": "mn-Mong-CN",
        "und-MQ": "fr-Latn-MQ",
        "und-MR": "ar-Arab-MR",
        "und-Mroo": "mro-Mroo-BD",
        "und-MT": "mt-Latn-MT",
        "und-Mtei": "mni-Mtei-IN",
        "und-MU": "mfe-Latn-MU",
        "und-Mult": "skr-Mult-PK",
        "und-MV": "dv-Thaa-MV",
        "und-MX": "es-Latn-MX",
        "und-MY": "ms-Latn-MY",
        "und-Mymr": "my-Mymr-MM",
        "und-Mymr-IN": "kht-Mymr-IN",
        "und-Mymr-TH": "mnw-Mymr-TH",
        "und-MZ": "pt-Latn-MZ",
        "und-NA": "af-Latn-NA",
        "und-Nand": "sa-Nand-IN",
        "und-Narb": "xna-Narb-SA",
        "und-Nbat": "arc-Nbat-JO",
        "und-NC": "fr-Latn-NC",
        "und-NE": "ha-Latn-NE",
        "und-Newa": "new-Newa-NP",
        "und-NI": "es-Latn-NI",
        "und-Nkoo": "man-Nkoo-GN",
        "und-NL": "nl-Latn-NL",
        "und-NO": "nb-Latn-NO",
        "und-NP": "ne-Deva-NP",
        "und-Nshu": "zhx-Nshu-CN",
        "und-Ogam": "sga-Ogam-IE",
        "und-Olck": "sat-Olck-IN",
        "und-OM": "ar-Arab-OM",
        "und-Orkh": "otk-Orkh-MN",
        "und-Orya": "or-Orya-IN",
        "und-Osge": "osa-Osge-US",
        "und-Osma": "so-Osma-SO",
        "und-PA": "es-Latn-PA",
        "und-Palm": "arc-Palm-SY",
        "und-Pauc": "ctd-Pauc-MM",
        "und-PE": "es-Latn-PE",
        "und-Perm": "kv-Perm-RU",
        "und-PF": "fr-Latn-PF",
        "und-PG": "tpi-Latn-PG",
        "und-PH": "fil-Latn-PH",
        "und-Phag": "lzh-Phag-CN",
        "und-Phli": "pal-Phli-IR",
        "und-Phlp": "pal-Phlp-CN",
        "und-Phnx": "phn-Phnx-LB",
        "und-PK": "ur-Arab-PK",
        "und-PL": "pl-Latn-PL",
        "und-Plrd": "hmd-Plrd-CN",
        "und-PM": "fr-Latn-PM",
        "und-PR": "es-Latn-PR",
        "und-Prti": "xpr-Prti-IR",
        "und-PS": "ar-Arab-PS",
        "und-PT": "pt-Latn-PT",
        "und-PW": "pau-Latn-PW",
        "und-PY": "gn-Latn-PY",
        "und-QA": "ar-Arab-QA",
        "und-QO": "en-Latn-DG",
        "und-RE": "fr-Latn-RE",
        "und-Rjng": "rej-Rjng-ID",
        "und-RO": "ro-Latn-RO",
        "und-Rohg": "rhg-Rohg-MM",
        "und-RS": "sr-Cyrl-RS",
        "und-RU": "ru-Cyrl-RU",
        "und-Runr": "non-Runr-SE",
        "und-RW": "rw-Latn-RW",
        "und-SA": "ar-Arab-SA",
        "und-Samr": "smp-Samr-IL",
        "und-Sarb": "xsa-Sarb-YE",
        "und-Saur": "saz-Saur-IN",
        "und-SC": "fr-Latn-SC",
        "und-SD": "ar-Arab-SD",
        "und-SE": "sv-Latn-SE",
        "und-Sgnw": "ase-Sgnw-US",
        "und-Shaw": "en-Shaw-GB",
        "und-Shrd": "sa-Shrd-IN",
        "und-SI": "sl-Latn-SI",
        "und-Sidd": "sa-Sidd-IN",
        "und-Sind": "sd-Sind-IN",
        "und-Sinh": "si-Sinh-LK",
        "und-SJ": "nb-Latn-SJ",
        "und-SK": "sk-Latn-SK",
        "und-SM": "it-Latn-SM",
        "und-SN": "fr-Latn-SN",
        "und-SO": "so-Latn-SO",
        "und-Sogd": "sog-Sogd-UZ",
        "und-Sogo": "sog-Sogo-UZ",
        "und-Sora": "srb-Sora-IN",
        "und-Soyo": "cmg-Soyo-MN",
        "und-SR": "nl-Latn-SR",
        "und-ST": "pt-Latn-ST",
        "und-Sund": "su-Sund-ID",
        "und-SV": "es-Latn-SV",
        "und-SY": "ar-Arab-SY",
        "und-Sylo": "syl-Sylo-BD",
        "und-Syrc": "syr-Syrc-IQ",
        "und-Tagb": "tbw-Tagb-PH",
        "und-Takr": "doi-Takr-IN",
        "und-Tale": "tdd-Tale-CN",
        "und-Talu": "khb-Talu-CN",
        "und-Taml": "ta-Taml-IN",
        "und-Tang": "txg-Tang-CN",
        "und-Tavt": "blt-Tavt-VN",
        "und-TD": "fr-Latn-TD",
        "und-Telu": "te-Telu-IN",
        "und-TF": "fr-Latn-TF",
        "und-Tfng": "zgh-Tfng-MA",
        "und-TG": "fr-Latn-TG",
        "und-Tglg": "fil-Tglg-PH",
        "und-TH": "th-Thai-TH",
        "und-Thaa": "dv-Thaa-MV",
        "und-Thai": "th-Thai-TH",
        "und-Thai-CN": "lcp-Thai-CN",
        "und-Thai-KH": "kdt-Thai-KH",
        "und-Thai-LA": "kdt-Thai-LA",
        "und-Tibt": "bo-Tibt-CN",
        "und-Tirh": "mai-Tirh-IN",
        "und-TJ": "tg-Cyrl-TJ",
        "und-TK": "tkl-Latn-TK",
        "und-TL": "pt-Latn-TL",
        "und-TM": "tk-Latn-TM",
        "und-TN": "ar-Arab-TN",
        "und-TO": "to-Latn-TO",
        "und-TR": "tr-Latn-TR",
        "und-TV": "tvl-Latn-TV",
        "und-TW": "zh-Hant-TW",
        "und-TZ": "sw-Latn-TZ",
        "und-UA": "uk-Cyrl-UA",
        "und-UG": "sw-Latn-UG",
        "und-Ugar": "uga-Ugar-SY",
        "und-UY": "es-Latn-UY",
        "und-UZ": "uz-Latn-UZ",
        "und-VA": "it-Latn-VA",
        "und-Vaii": "vai-Vaii-LR",
        "und-VE": "es-Latn-VE",
        "und-VN": "vi-Latn-VN",
        "und-VU": "bi-Latn-VU",
        "und-Wara": "hoc-Wara-IN",
        "und-Wcho": "nnp-Wcho-IN",
        "und-WF": "fr-Latn-WF",
        "und-WS": "sm-Latn-WS",
        "und-XK": "sq-Latn-XK",
        "und-Xpeo": "peo-Xpeo-IR",
        "und-Xsux": "akk-Xsux-IQ",
        "und-YE": "ar-Arab-YE",
        "und-Yezi": "ku-Yezi-GE",
        "und-Yiii": "ii-Yiii-CN",
        "und-YT": "fr-Latn-YT",
        "und-Zanb": "cmg-Zanb-MN",
        "und-ZW": "sn-Latn-ZW",
        unr: "unr-Beng-IN",
        "unr-Deva": "unr-Deva-NP",
        "unr-NP": "unr-Deva-NP",
        unx: "unx-Beng-IN",
        uok: "uok-Latn-ZZ",
        ur: "ur-Arab-PK",
        uri: "uri-Latn-ZZ",
        urt: "urt-Latn-ZZ",
        urw: "urw-Latn-ZZ",
        usa: "usa-Latn-ZZ",
        utr: "utr-Latn-ZZ",
        uvh: "uvh-Latn-ZZ",
        uvl: "uvl-Latn-ZZ",
        uz: "uz-Latn-UZ",
        "uz-AF": "uz-Arab-AF",
        "uz-Arab": "uz-Arab-AF",
        "uz-CN": "uz-Cyrl-CN",
        vag: "vag-Latn-ZZ",
        vai: "vai-Vaii-LR",
        van: "van-Latn-ZZ",
        ve: "ve-Latn-ZA",
        vec: "vec-Latn-IT",
        vep: "vep-Latn-RU",
        vi: "vi-Latn-VN",
        vic: "vic-Latn-SX",
        viv: "viv-Latn-ZZ",
        vls: "vls-Latn-BE",
        vmf: "vmf-Latn-DE",
        vmw: "vmw-Latn-MZ",
        vo: "vo-Latn-001",
        vot: "vot-Latn-RU",
        vro: "vro-Latn-EE",
        vun: "vun-Latn-TZ",
        vut: "vut-Latn-ZZ",
        wa: "wa-Latn-BE",
        wae: "wae-Latn-CH",
        waj: "waj-Latn-ZZ",
        wal: "wal-Ethi-ET",
        wan: "wan-Latn-ZZ",
        war: "war-Latn-PH",
        wbp: "wbp-Latn-AU",
        wbq: "wbq-Telu-IN",
        wbr: "wbr-Deva-IN",
        wci: "wci-Latn-ZZ",
        wer: "wer-Latn-ZZ",
        wgi: "wgi-Latn-ZZ",
        whg: "whg-Latn-ZZ",
        wib: "wib-Latn-ZZ",
        wiu: "wiu-Latn-ZZ",
        wiv: "wiv-Latn-ZZ",
        wja: "wja-Latn-ZZ",
        wji: "wji-Latn-ZZ",
        wls: "wls-Latn-WF",
        wmo: "wmo-Latn-ZZ",
        wnc: "wnc-Latn-ZZ",
        wni: "wni-Arab-KM",
        wnu: "wnu-Latn-ZZ",
        wo: "wo-Latn-SN",
        wob: "wob-Latn-ZZ",
        wos: "wos-Latn-ZZ",
        wrs: "wrs-Latn-ZZ",
        wsg: "wsg-Gong-IN",
        wsk: "wsk-Latn-ZZ",
        wtm: "wtm-Deva-IN",
        wuu: "wuu-Hans-CN",
        wuv: "wuv-Latn-ZZ",
        wwa: "wwa-Latn-ZZ",
        xav: "xav-Latn-BR",
        xbi: "xbi-Latn-ZZ",
        xco: "xco-Chrs-UZ",
        xcr: "xcr-Cari-TR",
        xes: "xes-Latn-ZZ",
        xh: "xh-Latn-ZA",
        xla: "xla-Latn-ZZ",
        xlc: "xlc-Lyci-TR",
        xld: "xld-Lydi-TR",
        xmf: "xmf-Geor-GE",
        xmn: "xmn-Mani-CN",
        xmr: "xmr-Merc-SD",
        xna: "xna-Narb-SA",
        xnr: "xnr-Deva-IN",
        xog: "xog-Latn-UG",
        xon: "xon-Latn-ZZ",
        xpr: "xpr-Prti-IR",
        xrb: "xrb-Latn-ZZ",
        xsa: "xsa-Sarb-YE",
        xsi: "xsi-Latn-ZZ",
        xsm: "xsm-Latn-ZZ",
        xsr: "xsr-Deva-NP",
        xwe: "xwe-Latn-ZZ",
        yam: "yam-Latn-ZZ",
        yao: "yao-Latn-MZ",
        yap: "yap-Latn-FM",
        yas: "yas-Latn-ZZ",
        yat: "yat-Latn-ZZ",
        yav: "yav-Latn-CM",
        yay: "yay-Latn-ZZ",
        yaz: "yaz-Latn-ZZ",
        yba: "yba-Latn-ZZ",
        ybb: "ybb-Latn-CM",
        yby: "yby-Latn-ZZ",
        yer: "yer-Latn-ZZ",
        ygr: "ygr-Latn-ZZ",
        ygw: "ygw-Latn-ZZ",
        yi: "yi-Hebr-001",
        yko: "yko-Latn-ZZ",
        yle: "yle-Latn-ZZ",
        ylg: "ylg-Latn-ZZ",
        yll: "yll-Latn-ZZ",
        yml: "yml-Latn-ZZ",
        yo: "yo-Latn-NG",
        yon: "yon-Latn-ZZ",
        yrb: "yrb-Latn-ZZ",
        yre: "yre-Latn-ZZ",
        yrl: "yrl-Latn-BR",
        yss: "yss-Latn-ZZ",
        yua: "yua-Latn-MX",
        yue: "yue-Hant-HK",
        "yue-CN": "yue-Hans-CN",
        "yue-Hans": "yue-Hans-CN",
        yuj: "yuj-Latn-ZZ",
        yut: "yut-Latn-ZZ",
        yuw: "yuw-Latn-ZZ",
        za: "za-Latn-CN",
        zag: "zag-Latn-SD",
        zdj: "zdj-Arab-KM",
        zea: "zea-Latn-NL",
        zgh: "zgh-Tfng-MA",
        zh: "zh-Hans-CN",
        "zh-AU": "zh-Hant-AU",
        "zh-BN": "zh-Hant-BN",
        "zh-Bopo": "zh-Bopo-TW",
        "zh-GB": "zh-Hant-GB",
        "zh-GF": "zh-Hant-GF",
        "zh-Hanb": "zh-Hanb-TW",
        "zh-Hant": "zh-Hant-TW",
        "zh-HK": "zh-Hant-HK",
        "zh-ID": "zh-Hant-ID",
        "zh-MO": "zh-Hant-MO",
        "zh-MY": "zh-Hant-MY",
        "zh-PA": "zh-Hant-PA",
        "zh-PF": "zh-Hant-PF",
        "zh-PH": "zh-Hant-PH",
        "zh-SR": "zh-Hant-SR",
        "zh-TH": "zh-Hant-TH",
        "zh-TW": "zh-Hant-TW",
        "zh-US": "zh-Hant-US",
        "zh-VN": "zh-Hant-VN",
        zhx: "zhx-Nshu-CN",
        zia: "zia-Latn-ZZ",
        zkt: "zkt-Kits-CN",
        zlm: "zlm-Latn-TG",
        zmi: "zmi-Latn-MY",
        zne: "zne-Latn-ZZ",
        zu: "zu-Latn-ZA",
        zza: "zza-Latn-TR",
      },
    },
  });

  //en-US/numbers.json
  Globalize.load({
    main: {
      "en-US-POSIX": {
        identity: {
          version: {
            _cldrVersion: "37",
          },
          language: "en",
          territory: "US",
          variant: "POSIX",
        },
        numbers: {
          defaultNumberingSystem: "latn",
          otherNumberingSystems: {
            native: "latn",
          },
          minimumGroupingDigits: "1",
          "symbols-numberSystem-latn": {
            decimal: ".",
            group: ",",
            list: ";",
            percentSign: "%",
            plusSign: "+",
            minusSign: "-",
            exponential: "E",
            superscriptingExponent: "×",
            perMille: "0/00",
            infinity: "INF",
            nan: "NaN",
            timeSeparator: ":",
          },
          "decimalFormats-numberSystem-latn": {
            standard: "0.######",
            long: {
              decimalFormat: {
                "1000-count-one": "0 thousand",
                "1000-count-other": "0 thousand",
                "10000-count-one": "00 thousand",
                "10000-count-other": "00 thousand",
                "100000-count-one": "000 thousand",
                "100000-count-other": "000 thousand",
                "1000000-count-one": "0 million",
                "1000000-count-other": "0 million",
                "10000000-count-one": "00 million",
                "10000000-count-other": "00 million",
                "100000000-count-one": "000 million",
                "100000000-count-other": "000 million",
                "1000000000-count-one": "0 billion",
                "1000000000-count-other": "0 billion",
                "10000000000-count-one": "00 billion",
                "10000000000-count-other": "00 billion",
                "100000000000-count-one": "000 billion",
                "100000000000-count-other": "000 billion",
                "1000000000000-count-one": "0 trillion",
                "1000000000000-count-other": "0 trillion",
                "10000000000000-count-one": "00 trillion",
                "10000000000000-count-other": "00 trillion",
                "100000000000000-count-one": "000 trillion",
                "100000000000000-count-other": "000 trillion",
              },
            },
            short: {
              decimalFormat: {
                "1000-count-one": "0K",
                "1000-count-other": "0K",
                "10000-count-one": "00K",
                "10000-count-other": "00K",
                "100000-count-one": "000K",
                "100000-count-other": "000K",
                "1000000-count-one": "0M",
                "1000000-count-other": "0M",
                "10000000-count-one": "00M",
                "10000000-count-other": "00M",
                "100000000-count-one": "000M",
                "100000000-count-other": "000M",
                "1000000000-count-one": "0B",
                "1000000000-count-other": "0B",
                "10000000000-count-one": "00B",
                "10000000000-count-other": "00B",
                "100000000000-count-one": "000B",
                "100000000000-count-other": "000B",
                "1000000000000-count-one": "0T",
                "1000000000000-count-other": "0T",
                "10000000000000-count-one": "00T",
                "10000000000000-count-other": "00T",
                "100000000000000-count-one": "000T",
                "100000000000000-count-other": "000T",
              },
            },
          },
          "scientificFormats-numberSystem-latn": {
            standard: "0.000000E+000",
          },
          "percentFormats-numberSystem-latn": {
            standard: "0%",
          },
          "currencyFormats-numberSystem-latn": {
            currencySpacing: {
              beforeCurrency: {
                currencyMatch: "[:^S:]",
                surroundingMatch: "[:digit:]",
                insertBetween: " ",
              },
              afterCurrency: {
                currencyMatch: "[:^S:]",
                surroundingMatch: "[:digit:]",
                insertBetween: " ",
              },
            },
            standard: "¤ 0.00",
            accounting: "¤#,##0.00;(¤#,##0.00)",
            short: {
              standard: {
                "1000-count-one": "¤0K",
                "1000-count-other": "¤0K",
                "10000-count-one": "¤00K",
                "10000-count-other": "¤00K",
                "100000-count-one": "¤000K",
                "100000-count-other": "¤000K",
                "1000000-count-one": "¤0M",
                "1000000-count-other": "¤0M",
                "10000000-count-one": "¤00M",
                "10000000-count-other": "¤00M",
                "100000000-count-one": "¤000M",
                "100000000-count-other": "¤000M",
                "1000000000-count-one": "¤0B",
                "1000000000-count-other": "¤0B",
                "10000000000-count-one": "¤00B",
                "10000000000-count-other": "¤00B",
                "100000000000-count-one": "¤000B",
                "100000000000-count-other": "¤000B",
                "1000000000000-count-one": "¤0T",
                "1000000000000-count-other": "¤0T",
                "10000000000000-count-one": "¤00T",
                "10000000000000-count-other": "¤00T",
                "100000000000000-count-one": "¤000T",
                "100000000000000-count-other": "¤000T",
              },
            },
            "unitPattern-count-one": "{0} {1}",
            "unitPattern-count-other": "{0} {1}",
          },
          "miscPatterns-numberSystem-latn": {
            approximately: "~{0}",
            atLeast: "{0}+",
            atMost: "≤{0}",
            range: "{0}–{1}",
          },
          minimalPairs: {
            "pluralMinimalPairs-count-one": "{0} day",
            "pluralMinimalPairs-count-other": "{0} days",
            few: "Take the {0}rd right.",
            one: "Take the {0}st right.",
            other: "Take the {0}th right.",
            two: "Take the {0}nd right.",
          },
        },
      },
    },
  });

  //numberingSystems.json
  Globalize.load({
    supplemental: {
      version: {
        _unicodeVersion: "13.0.0",
        _cldrVersion: "37",
      },
      numberingSystems: {
        adlm: {
          _digits: "𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙",
          _type: "numeric",
        },
        ahom: {
          _digits: "𑜰𑜱𑜲𑜳𑜴𑜵𑜶𑜷𑜸𑜹",
          _type: "numeric",
        },
        arab: {
          _digits: "٠١٢٣٤٥٦٧٨٩",
          _type: "numeric",
        },
        arabext: {
          _digits: "۰۱۲۳۴۵۶۷۸۹",
          _type: "numeric",
        },
        armn: {
          _rules: "armenian-upper",
          _type: "algorithmic",
        },
        armnlow: {
          _rules: "armenian-lower",
          _type: "algorithmic",
        },
        bali: {
          _digits: "᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙",
          _type: "numeric",
        },
        beng: {
          _digits: "০১২৩৪৫৬৭৮৯",
          _type: "numeric",
        },
        bhks: {
          _digits: "𑱐𑱑𑱒𑱓𑱔𑱕𑱖𑱗𑱘𑱙",
          _type: "numeric",
        },
        brah: {
          _digits: "𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯",
          _type: "numeric",
        },
        cakm: {
          _digits: "𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿",
          _type: "numeric",
        },
        cham: {
          _digits: "꩐꩑꩒꩓꩔꩕꩖꩗꩘꩙",
          _type: "numeric",
        },
        cyrl: {
          _rules: "cyrillic-lower",
          _type: "algorithmic",
        },
        deva: {
          _digits: "०१२३४५६७८९",
          _type: "numeric",
        },
        diak: {
          _digits: "𑥐𑥑𑥒𑥓𑥔𑥕𑥖𑥗𑥘𑥙",
          _type: "numeric",
        },
        ethi: {
          _rules: "ethiopic",
          _type: "algorithmic",
        },
        fullwide: {
          _digits: "０１２３４５６７８９",
          _type: "numeric",
        },
        geor: {
          _rules: "georgian",
          _type: "algorithmic",
        },
        gong: {
          _digits: "𑶠𑶡𑶢𑶣𑶤𑶥𑶦𑶧𑶨𑶩",
          _type: "numeric",
        },
        gonm: {
          _digits: "𑵐𑵑𑵒𑵓𑵔𑵕𑵖𑵗𑵘𑵙",
          _type: "numeric",
        },
        grek: {
          _rules: "greek-upper",
          _type: "algorithmic",
        },
        greklow: {
          _rules: "greek-lower",
          _type: "algorithmic",
        },
        gujr: {
          _digits: "૦૧૨૩૪૫૬૭૮૯",
          _type: "numeric",
        },
        guru: {
          _digits: "੦੧੨੩੪੫੬੭੮੯",
          _type: "numeric",
        },
        hanidays: {
          _rules: "zh/SpelloutRules/spellout-numbering-days",
          _type: "algorithmic",
        },
        hanidec: {
          _digits: "〇一二三四五六七八九",
          _type: "numeric",
        },
        hans: {
          _rules: "zh/SpelloutRules/spellout-cardinal",
          _type: "algorithmic",
        },
        hansfin: {
          _rules: "zh/SpelloutRules/spellout-cardinal-financial",
          _type: "algorithmic",
        },
        hant: {
          _rules: "zh_Hant/SpelloutRules/spellout-cardinal",
          _type: "algorithmic",
        },
        hantfin: {
          _rules: "zh_Hant/SpelloutRules/spellout-cardinal-financial",
          _type: "algorithmic",
        },
        hebr: {
          _rules: "hebrew",
          _type: "algorithmic",
        },
        hmng: {
          _digits: "𖭐𖭑𖭒𖭓𖭔𖭕𖭖𖭗𖭘𖭙",
          _type: "numeric",
        },
        hmnp: {
          _digits: "𞅀𞅁𞅂𞅃𞅄𞅅𞅆𞅇𞅈𞅉",
          _type: "numeric",
        },
        java: {
          _digits: "꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙",
          _type: "numeric",
        },
        jpan: {
          _rules: "ja/SpelloutRules/spellout-cardinal",
          _type: "algorithmic",
        },
        jpanfin: {
          _rules: "ja/SpelloutRules/spellout-cardinal-financial",
          _type: "algorithmic",
        },
        jpanyear: {
          _rules: "ja/SpelloutRules/spellout-numbering-year-latn",
          _type: "algorithmic",
        },
        kali: {
          _digits: "꤀꤁꤂꤃꤄꤅꤆꤇꤈꤉",
          _type: "numeric",
        },
        khmr: {
          _digits: "០១២៣៤៥៦៧៨៩",
          _type: "numeric",
        },
        knda: {
          _digits: "೦೧೨೩೪೫೬೭೮೯",
          _type: "numeric",
        },
        lana: {
          _digits: "᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉",
          _type: "numeric",
        },
        lanatham: {
          _digits: "᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙",
          _type: "numeric",
        },
        laoo: {
          _digits: "໐໑໒໓໔໕໖໗໘໙",
          _type: "numeric",
        },
        latn: {
          _digits: "0123456789",
          _type: "numeric",
        },
        lepc: {
          _digits: "᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉",
          _type: "numeric",
        },
        limb: {
          _digits: "᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏",
          _type: "numeric",
        },
        mathbold: {
          _digits: "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
          _type: "numeric",
        },
        mathdbl: {
          _digits: "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
          _type: "numeric",
        },
        mathmono: {
          _digits: "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
          _type: "numeric",
        },
        mathsanb: {
          _digits: "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
          _type: "numeric",
        },
        mathsans: {
          _digits: "𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
          _type: "numeric",
        },
        mlym: {
          _digits: "൦൧൨൩൪൫൬൭൮൯",
          _type: "numeric",
        },
        modi: {
          _digits: "𑙐𑙑𑙒𑙓𑙔𑙕𑙖𑙗𑙘𑙙",
          _type: "numeric",
        },
        mong: {
          _digits: "᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙",
          _type: "numeric",
        },
        mroo: {
          _digits: "𖩠𖩡𖩢𖩣𖩤𖩥𖩦𖩧𖩨𖩩",
          _type: "numeric",
        },
        mtei: {
          _digits: "꯰꯱꯲꯳꯴꯵꯶꯷꯸꯹",
          _type: "numeric",
        },
        mymr: {
          _digits: "၀၁၂၃၄၅၆၇၈၉",
          _type: "numeric",
        },
        mymrshan: {
          _digits: "႐႑႒႓႔႕႖႗႘႙",
          _type: "numeric",
        },
        mymrtlng: {
          _digits: "꧰꧱꧲꧳꧴꧵꧶꧷꧸꧹",
          _type: "numeric",
        },
        newa: {
          _digits: "𑑐𑑑𑑒𑑓𑑔𑑕𑑖𑑗𑑘𑑙",
          _type: "numeric",
        },
        nkoo: {
          _digits: "߀߁߂߃߄߅߆߇߈߉",
          _type: "numeric",
        },
        olck: {
          _digits: "᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙",
          _type: "numeric",
        },
        orya: {
          _digits: "୦୧୨୩୪୫୬୭୮୯",
          _type: "numeric",
        },
        osma: {
          _digits: "𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩",
          _type: "numeric",
        },
        rohg: {
          _digits: "𐴰𐴱𐴲𐴳𐴴𐴵𐴶𐴷𐴸𐴹",
          _type: "numeric",
        },
        roman: {
          _rules: "roman-upper",
          _type: "algorithmic",
        },
        romanlow: {
          _rules: "roman-lower",
          _type: "algorithmic",
        },
        saur: {
          _digits: "꣐꣑꣒꣓꣔꣕꣖꣗꣘꣙",
          _type: "numeric",
        },
        segment: {
          _digits: "🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹",
          _type: "numeric",
        },
        shrd: {
          _digits: "𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙",
          _type: "numeric",
        },
        sind: {
          _digits: "𑋰𑋱𑋲𑋳𑋴𑋵𑋶𑋷𑋸𑋹",
          _type: "numeric",
        },
        sinh: {
          _digits: "෦෧෨෩෪෫෬෭෮෯",
          _type: "numeric",
        },
        sora: {
          _digits: "𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹",
          _type: "numeric",
        },
        sund: {
          _digits: "᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹",
          _type: "numeric",
        },
        takr: {
          _digits: "𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉",
          _type: "numeric",
        },
        talu: {
          _digits: "᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙",
          _type: "numeric",
        },
        taml: {
          _rules: "tamil",
          _type: "algorithmic",
        },
        tamldec: {
          _digits: "௦௧௨௩௪௫௬௭௮௯",
          _type: "numeric",
        },
        telu: {
          _digits: "౦౧౨౩౪౫౬౭౮౯",
          _type: "numeric",
        },
        thai: {
          _digits: "๐๑๒๓๔๕๖๗๘๙",
          _type: "numeric",
        },
        tibt: {
          _digits: "༠༡༢༣༤༥༦༧༨༩",
          _type: "numeric",
        },
        tirh: {
          _digits: "𑓐𑓑𑓒𑓓𑓔𑓕𑓖𑓗𑓘𑓙",
          _type: "numeric",
        },
        vaii: {
          _digits: "꘠꘡꘢꘣꘤꘥꘦꘧꘨꘩",
          _type: "numeric",
        },
        wara: {
          _digits: "𑣠𑣡𑣢𑣣𑣤𑣥𑣦𑣧𑣨𑣩",
          _type: "numeric",
        },
        wcho: {
          _digits: "𞋰𞋱𞋲𞋳𞋴𞋵𞋶𞋷𞋸𞋹",
          _type: "numeric",
        },
      },
    },
  });

  //plurals.json
  Globalize.load({
    supplemental: {
      version: {
        _unicodeVersion: "13.0.0",
        _cldrVersion: "37",
      },
      "plurals-type-cardinal": {
        af: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ak: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        am: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        an: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ar: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-few":
            "n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …",
          "pluralRule-count-many":
            "n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …",
          "pluralRule-count-other":
            " @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ars: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-few":
            "n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …",
          "pluralRule-count-many":
            "n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …",
          "pluralRule-count-other":
            " @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        as: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        asa: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ast: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        az: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        be: {
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …",
          "pluralRule-count-few":
            "n % 10 = 2..4 and n % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 2.0, 3.0, 4.0, 22.0, 23.0, 24.0, 32.0, 33.0, 102.0, 1002.0, …",
          "pluralRule-count-many":
            "n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            "	 @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …",
        },
        bem: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bez: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bg: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bho: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bm: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bn: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        br: {
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11,71,91 @integer 1, 21, 31, 41, 51, 61, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 81.0, 101.0, 1001.0, …",
          "pluralRule-count-two":
            "n % 10 = 2 and n % 100 != 12,72,92 @integer 2, 22, 32, 42, 52, 62, 82, 102, 1002, … @decimal 2.0, 22.0, 32.0, 42.0, 52.0, 62.0, 82.0, 102.0, 1002.0, …",
          "pluralRule-count-few":
            "n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99 @integer 3, 4, 9, 23, 24, 29, 33, 34, 39, 43, 44, 49, 103, 1003, … @decimal 3.0, 4.0, 9.0, 23.0, 24.0, 29.0, 33.0, 34.0, 103.0, 1003.0, …",
          "pluralRule-count-many":
            "n != 0 and n % 1000000 = 0 @integer 1000000, … @decimal 1000000.0, 1000000.00, 1000000.000, …",
          "pluralRule-count-other":
            " @integer 0, 5~8, 10~20, 100, 1000, 10000, 100000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, …",
        },
        brx: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        bs: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ca: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ce: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ceb: {
          "pluralRule-count-one":
            "v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …",
        },
        cgg: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        chr: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ckb: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        cs: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-few": "i = 2..4 and v = 0 @integer 2~4",
          "pluralRule-count-many":
            "v != 0	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        cy: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-few":
            "n = 3 @integer 3 @decimal 3.0, 3.00, 3.000, 3.0000",
          "pluralRule-count-many":
            "n = 6 @integer 6 @decimal 6.0, 6.00, 6.000, 6.0000",
          "pluralRule-count-other":
            " @integer 4, 5, 7~20, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        da: {
          "pluralRule-count-one":
            "n = 1 or t != 0 and i = 0,1 @integer 1 @decimal 0.1~1.6",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0~3.4, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        de: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        dsb: {
          "pluralRule-count-one":
            "v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-two":
            "v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-few":
            "v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        dv: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        dz: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ee: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        el: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        en: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        eo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        es: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        et: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        eu: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fa: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ff: {
          "pluralRule-count-one": "i = 0,1 @integer 0, 1 @decimal 0.0~1.5",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fi: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fil: {
          "pluralRule-count-one":
            "v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …",
        },
        fo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fr: {
          "pluralRule-count-one": "i = 0,1 @integer 0, 1 @decimal 0.0~1.5",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fur: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        fy: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ga: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-few":
            "n = 3..6 @integer 3~6 @decimal 3.0, 4.0, 5.0, 6.0, 3.00, 4.00, 5.00, 6.00, 3.000, 4.000, 5.000, 6.000, 3.0000, 4.0000, 5.0000, 6.0000",
          "pluralRule-count-many":
            "n = 7..10 @integer 7~10 @decimal 7.0, 8.0, 9.0, 10.0, 7.00, 8.00, 9.00, 10.00, 7.000, 8.000, 9.000, 10.000, 7.0000, 8.0000, 9.0000, 10.0000",
          "pluralRule-count-other":
            " @integer 0, 11~25, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        gd: {
          "pluralRule-count-one":
            "n = 1,11 @integer 1, 11 @decimal 1.0, 11.0, 1.00, 11.00, 1.000, 11.000, 1.0000",
          "pluralRule-count-two":
            "n = 2,12 @integer 2, 12 @decimal 2.0, 12.0, 2.00, 12.00, 2.000, 12.000, 2.0000",
          "pluralRule-count-few":
            "n = 3..10,13..19 @integer 3~10, 13~19 @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 3.00",
          "pluralRule-count-other":
            " @integer 0, 20~34, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        gl: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        gsw: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        gu: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        guw: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        gv: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 @integer 1, 11, 21, 31, 41, 51, 61, 71, 101, 1001, …",
          "pluralRule-count-two":
            "v = 0 and i % 10 = 2 @integer 2, 12, 22, 32, 42, 52, 62, 72, 102, 1002, …",
          "pluralRule-count-few":
            "v = 0 and i % 100 = 0,20,40,60,80 @integer 0, 20, 40, 60, 80, 100, 120, 140, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-many":
            "v != 0	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other": " @integer 3~10, 13~19, 23, 103, 1003, …",
        },
        ha: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        haw: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        he: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-two": "i = 2 and v = 0 @integer 2",
          "pluralRule-count-many":
            "v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            " @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        hi: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        hr: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        hsb: {
          "pluralRule-count-one":
            "v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-two":
            "v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-few":
            "v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        hu: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        hy: {
          "pluralRule-count-one": "i = 0,1 @integer 0, 1 @decimal 0.0~1.5",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ia: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        id: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ig: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ii: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        in: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        io: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        is: {
          "pluralRule-count-one":
            "t = 0 and i % 10 = 1 and i % 100 != 11 or t != 0 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1~1.6, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        it: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        iu: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        iw: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-two": "i = 2 and v = 0 @integer 2",
          "pluralRule-count-many":
            "v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            " @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ja: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        jbo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        jgo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ji: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        jmc: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        jv: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        jw: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ka: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kab: {
          "pluralRule-count-one": "i = 0,1 @integer 0, 1 @decimal 0.0~1.5",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kaj: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kcg: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kde: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kea: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kk: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kkj: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kl: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        km: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kn: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ko: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ks: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ksb: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ksh: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ku: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        kw: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n % 100 = 2,22,42,62,82 or n % 1000 = 0 and n % 100000 = 1000..20000,40000,60000,80000 or n != 0 and n % 1000000 = 100000 @integer 2, 22, 42, 62, 82, 102, 122, 142, 1000, 10000, 100000, … @decimal 2.0, 22.0, 42.0, 62.0, 82.0, 102.0, 122.0, 142.0, 1000.0, 10000.0, 100000.0, …",
          "pluralRule-count-few":
            "n % 100 = 3,23,43,63,83 @integer 3, 23, 43, 63, 83, 103, 123, 143, 1003, … @decimal 3.0, 23.0, 43.0, 63.0, 83.0, 103.0, 123.0, 143.0, 1003.0, …",
          "pluralRule-count-many":
            "n != 1 and n % 100 = 1,21,41,61,81 @integer 21, 41, 61, 81, 101, 121, 141, 161, 1001, … @decimal 21.0, 41.0, 61.0, 81.0, 101.0, 121.0, 141.0, 161.0, 1001.0, …",
          "pluralRule-count-other":
            " @integer 4~19, 100, 1004, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.1, 1000000.0, …",
        },
        ky: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lag: {
          "pluralRule-count-zero":
            "n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000",
          "pluralRule-count-one":
            "i = 0,1 and n != 0 @integer 1 @decimal 0.1~1.6",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lb: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lg: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lkt: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ln: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lt: {
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11..19 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …",
          "pluralRule-count-few":
            "n % 10 = 2..9 and n % 100 != 11..19 @integer 2~9, 22~29, 102, 1002, … @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 22.0, 102.0, 1002.0, …",
          "pluralRule-count-many":
            "f != 0	 @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-other":
            " @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        lv: {
          "pluralRule-count-zero":
            "n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-other":
            " @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …",
        },
        mas: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mg: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mgo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mk: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.2~1.0, 1.2~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ml: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mo: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-few":
            "v != 0 or n = 0 or n % 100 = 2..19 @integer 0, 2~16, 102, 1002, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 20~35, 100, 1000, 10000, 100000, 1000000, …",
        },
        mr: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ms: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        mt: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-few":
            "n = 0 or n % 100 = 2..10 @integer 0, 2~10, 102~107, 1002, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 102.0, 1002.0, …",
          "pluralRule-count-many":
            "n % 100 = 11..19 @integer 11~19, 111~117, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …",
          "pluralRule-count-other":
            " @integer 20~35, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        my: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nah: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        naq: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nb: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nd: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ne: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nl: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nnh: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        no: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nqo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nr: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nso: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ny: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        nyn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        om: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        or: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        os: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        osa: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        pa: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        pap: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        pcm: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        pl: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …",
          "pluralRule-count-many":
            "v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            "	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        prg: {
          "pluralRule-count-zero":
            "n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-other":
            " @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …",
        },
        ps: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        pt: {
          "pluralRule-count-one": "i = 0..1 @integer 0, 1 @decimal 0.0~1.5",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        "pt-PT": {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        rm: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ro: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-few":
            "v != 0 or n = 0 or n % 100 = 2..19 @integer 0, 2~16, 102, 1002, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 20~35, 100, 1000, 10000, 100000, 1000000, …",
        },
        rof: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        root: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ru: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …",
          "pluralRule-count-many":
            "v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            "	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        rwk: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sah: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        saq: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sat: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sc: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        scn: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sd: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sdh: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        se: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        seh: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ses: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sg: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sh: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        shi: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-few":
            "n = 2..10 @integer 2~10 @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00",
          "pluralRule-count-other":
            " @integer 11~26, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~1.9, 2.1~2.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        si: {
          "pluralRule-count-one":
            "n = 0,1 or i = 0 and f = 1 @integer 0, 1 @decimal 0.0, 0.1, 1.0, 0.00, 0.01, 1.00, 0.000, 0.001, 1.000, 0.0000, 0.0001, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.2~0.9, 1.1~1.8, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sk: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-few": "i = 2..4 and v = 0 @integer 2~4",
          "pluralRule-count-many":
            "v != 0	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        sl: {
          "pluralRule-count-one":
            "v = 0 and i % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, …",
          "pluralRule-count-two":
            "v = 0 and i % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, …",
          "pluralRule-count-few":
            "v = 0 and i % 100 = 3..4 or v != 0 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        sma: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        smi: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        smj: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        smn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sms: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-two":
            "n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        so: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sq: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sr: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ss: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ssy: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        st: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        su: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sv: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        sw: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        syr: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ta: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        te: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        teo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        th: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ti: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        tig: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        tk: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        tl: {
          "pluralRule-count-one":
            "v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
          "pluralRule-count-other":
            " @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …",
        },
        tn: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        to: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        tr: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ts: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        tzm: {
          "pluralRule-count-one":
            "n = 0..1 or n = 11..99 @integer 0, 1, 11~24 @decimal 0.0, 1.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0",
          "pluralRule-count-other":
            " @integer 2~10, 100~106, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ug: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        uk: {
          "pluralRule-count-one":
            "v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
          "pluralRule-count-few":
            "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …",
          "pluralRule-count-many":
            "v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            "	 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ur: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        uz: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        ve: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        vi: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        vo: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        vun: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        wa: {
          "pluralRule-count-one":
            "n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        wae: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        wo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        xh: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        xog: {
          "pluralRule-count-one":
            "n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        yi: {
          "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        yo: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        yue: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        zh: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
        zu: {
          "pluralRule-count-one":
            "i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04",
          "pluralRule-count-other":
            " @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
        },
      },
    },
  });

  //ordinals.json
  Globalize.load({
    supplemental: {
      version: {
        _unicodeVersion: "13.0.0",
        _cldrVersion: "37",
      },
      "plurals-type-ordinal": {
        af: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        am: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        an: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ar: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        as: {
          "pluralRule-count-one": "n = 1,5,7,8,9,10 @integer 1, 5, 7~10",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-many": "n = 6 @integer 6",
          "pluralRule-count-other":
            " @integer 0, 11~25, 100, 1000, 10000, 100000, 1000000, …",
        },
        az: {
          "pluralRule-count-one":
            "i % 10 = 1,2,5,7,8 or i % 100 = 20,50,70,80 @integer 1, 2, 5, 7, 8, 11, 12, 15, 17, 18, 20~22, 25, 101, 1001, …",
          "pluralRule-count-few":
            "i % 10 = 3,4 or i % 1000 = 100,200,300,400,500,600,700,800,900 @integer 3, 4, 13, 14, 23, 24, 33, 34, 43, 44, 53, 54, 63, 64, 73, 74, 100, 1003, …",
          "pluralRule-count-many":
            "i = 0 or i % 10 = 6 or i % 100 = 40,60,90 @integer 0, 6, 16, 26, 36, 40, 46, 56, 106, 1006, …",
          "pluralRule-count-other":
            " @integer 9, 10, 19, 29, 30, 39, 49, 59, 69, 79, 109, 1000, 10000, 100000, 1000000, …",
        },
        be: {
          "pluralRule-count-few":
            "n % 10 = 2,3 and n % 100 != 12,13 @integer 2, 3, 22, 23, 32, 33, 42, 43, 52, 53, 62, 63, 72, 73, 82, 83, 102, 1002, …",
          "pluralRule-count-other":
            " @integer 0, 1, 4~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        bg: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        bn: {
          "pluralRule-count-one": "n = 1,5,7,8,9,10 @integer 1, 5, 7~10",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-many": "n = 6 @integer 6",
          "pluralRule-count-other":
            " @integer 0, 11~25, 100, 1000, 10000, 100000, 1000000, …",
        },
        bs: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ca: {
          "pluralRule-count-one": "n = 1,3 @integer 1, 3",
          "pluralRule-count-two": "n = 2 @integer 2",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        ce: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        cs: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        cy: {
          "pluralRule-count-zero": "n = 0,7,8,9 @integer 0, 7~9",
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-two": "n = 2 @integer 2",
          "pluralRule-count-few": "n = 3,4 @integer 3, 4",
          "pluralRule-count-many": "n = 5,6 @integer 5, 6",
          "pluralRule-count-other":
            " @integer 10~25, 100, 1000, 10000, 100000, 1000000, …",
        },
        da: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        de: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        dsb: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        el: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        en: {
          "pluralRule-count-one":
            "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
          "pluralRule-count-two":
            "n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
          "pluralRule-count-few":
            "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
          "pluralRule-count-other":
            " @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, …",
        },
        es: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        et: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        eu: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        fa: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        fi: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        fil: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        fr: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        fy: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ga: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        gd: {
          "pluralRule-count-one": "n = 1,11 @integer 1, 11",
          "pluralRule-count-two": "n = 2,12 @integer 2, 12",
          "pluralRule-count-few": "n = 3,13 @integer 3, 13",
          "pluralRule-count-other":
            " @integer 0, 4~10, 14~21, 100, 1000, 10000, 100000, 1000000, …",
        },
        gl: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        gsw: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        gu: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-many": "n = 6 @integer 6",
          "pluralRule-count-other":
            " @integer 0, 5, 7~20, 100, 1000, 10000, 100000, 1000000, …",
        },
        he: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        hi: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-many": "n = 6 @integer 6",
          "pluralRule-count-other":
            " @integer 0, 5, 7~20, 100, 1000, 10000, 100000, 1000000, …",
        },
        hr: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        hsb: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        hu: {
          "pluralRule-count-one": "n = 1,5 @integer 1, 5",
          "pluralRule-count-other":
            " @integer 0, 2~4, 6~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        hy: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        ia: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        id: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        in: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        is: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        it: {
          "pluralRule-count-many": "n = 11,8,80,800 @integer 8, 11, 80, 800",
          "pluralRule-count-other":
            " @integer 0~7, 9, 10, 12~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        iw: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ja: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ka: {
          "pluralRule-count-one": "i = 1 @integer 1",
          "pluralRule-count-many":
            "i = 0 or i % 100 = 2..20,40,60,80 @integer 0, 2~16, 102, 1002, …",
          "pluralRule-count-other":
            " @integer 21~36, 100, 1000, 10000, 100000, 1000000, …",
        },
        kk: {
          "pluralRule-count-many":
            "n % 10 = 6 or n % 10 = 9 or n % 10 = 0 and n != 0 @integer 6, 9, 10, 16, 19, 20, 26, 29, 30, 36, 39, 40, 100, 1000, 10000, 100000, 1000000, …",
          "pluralRule-count-other":
            " @integer 0~5, 7, 8, 11~15, 17, 18, 21, 101, 1001, …",
        },
        km: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        kn: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ko: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        kw: {
          "pluralRule-count-one":
            "n = 1..4 or n % 100 = 1..4,21..24,41..44,61..64,81..84 @integer 1~4, 21~24, 41~44, 61~64, 101, 1001, …",
          "pluralRule-count-many":
            "n = 5 or n % 100 = 5 @integer 5, 105, 205, 305, 405, 505, 605, 705, 1005, …",
          "pluralRule-count-other":
            " @integer 0, 6~20, 100, 1000, 10000, 100000, 1000000, …",
        },
        ky: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        lo: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        lt: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        lv: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        mk: {
          "pluralRule-count-one":
            "i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
          "pluralRule-count-two":
            "i % 10 = 2 and i % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
          "pluralRule-count-many":
            "i % 10 = 7,8 and i % 100 != 17,18 @integer 7, 8, 27, 28, 37, 38, 47, 48, 57, 58, 67, 68, 77, 78, 87, 88, 107, 1007, …",
          "pluralRule-count-other":
            " @integer 0, 3~6, 9~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        ml: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        mn: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        mo: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        mr: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        ms: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        my: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        nb: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ne: {
          "pluralRule-count-one": "n = 1..4 @integer 1~4",
          "pluralRule-count-other":
            " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …",
        },
        nl: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        or: {
          "pluralRule-count-one": "n = 1,5,7..9 @integer 1, 5, 7~9",
          "pluralRule-count-two": "n = 2,3 @integer 2, 3",
          "pluralRule-count-few": "n = 4 @integer 4",
          "pluralRule-count-many": "n = 6 @integer 6",
          "pluralRule-count-other":
            " @integer 0, 10~24, 100, 1000, 10000, 100000, 1000000, …",
        },
        pa: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        pl: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        prg: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ps: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        pt: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ro: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        root: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ru: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sc: {
          "pluralRule-count-many": "n = 11,8,80,800 @integer 8, 11, 80, 800",
          "pluralRule-count-other":
            " @integer 0~7, 9, 10, 12~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        scn: {
          "pluralRule-count-many": "n = 11,8,80,800 @integer 8, 11, 80, 800",
          "pluralRule-count-other":
            " @integer 0~7, 9, 10, 12~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        sd: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sh: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        si: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sk: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sl: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sq: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-many":
            "n % 10 = 4 and n % 100 != 14 @integer 4, 24, 34, 44, 54, 64, 74, 84, 104, 1004, …",
          "pluralRule-count-other":
            " @integer 0, 2, 3, 5~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        sr: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        sv: {
          "pluralRule-count-one":
            "n % 10 = 1,2 and n % 100 != 11,12 @integer 1, 2, 21, 22, 31, 32, 41, 42, 51, 52, 61, 62, 71, 72, 81, 82, 101, 1001, …",
          "pluralRule-count-other":
            " @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, …",
        },
        sw: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        ta: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        te: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        th: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        tk: {
          "pluralRule-count-few":
            "n % 10 = 6,9 or n = 10 @integer 6, 9, 10, 16, 19, 26, 29, 36, 39, 106, 1006, …",
          "pluralRule-count-other":
            " @integer 0~5, 7, 8, 11~15, 17, 18, 20, 100, 1000, 10000, 100000, 1000000, …",
        },
        tl: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        tr: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        uk: {
          "pluralRule-count-few":
            "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
          "pluralRule-count-other":
            " @integer 0~2, 4~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        ur: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        uz: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        vi: {
          "pluralRule-count-one": "n = 1 @integer 1",
          "pluralRule-count-other":
            " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, …",
        },
        yue: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        zh: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
        zu: {
          "pluralRule-count-other":
            " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …",
        },
      },
    },
  });
}
