/** Possible grammatical genders */
export enum Gender {
  male,
  female,
  neuter,
}

/** Options that can be passed into the functions that translate names. */
export interface LanguageOptions {
  /** Determines whether the resulting string be returned in uppercase. */
  uppercase?: boolean;
  gender?: Gender;
  count?: number;
}
