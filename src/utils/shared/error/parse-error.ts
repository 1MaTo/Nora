export type ErrorInfo = {
  title: string;
  message?: string;
};

export const parseError = (error: unknown): ErrorInfo => {
  if (error instanceof Error) return { title: error.name, message: error.message };

  return { title: "Unknown error", message: String(error) };
};
