/** Possible grammatical genders */
export enum Gender {
  male = "male",
  female = "female",
  neuter = "neuter",
}

export interface LanguageOptions {
  uppercase?: boolean;
  gender?: Gender;
  count?: number;

  arg0?: string;
  arg1?: string;
}

export default LanguageOptions;
