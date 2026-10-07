export const contactEmail = "jamesjoelowery@gmail.com";

export type ContactValues = { name: string; email: string; message: string };
export type ContactField = keyof ContactValues;
export type ContactState = {
  status: "idle" | "error" | "sent";
  values: ContactValues;
  errors: Partial<Record<ContactField, string>>;
  notice: string;
  requestKey: string;
};

export const initialContactState: ContactState = {
  status: "idle",
  values: { name: "", email: "", message: "" },
  errors: {},
  notice: "",
  requestKey: "",
};
