import * as z from "zod";

export const formSchema = z.object({
   name: z.string().min(1, {
      message: "Имя не может быть короче 1 символа.",
   }),
   surname: z.string().min(1, {
      message: "Фамилия не может быть короче 1 символа.",
   }),
   dateOfBirth: z
   .string()
   .regex(/^\d{2}\.\d{2}\.\d{4}$/, {
      message:
         "Дата должна быть в формате ДД.ММ.ГГГГ (например, 28.04.2003).",
   })
   .refine(
      (val) => {
         const parts = val.split(".");
         const day = parseInt(parts[0], 10);
         const month = parseInt(parts[1], 10);
         const year = parseInt(parts[2], 10);

         if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

         const date = new Date(year, month - 1, day);
         const isValidDate =
           date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;

         return isValidDate;
      },
      {
         message:
           "Некорректная или недопустимая дата (например, 31 февраля).",
      }
   )
   .transform((val) => {
      const parts = val.split('.');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day)
      return date.toString();
   }), // Преобразуем Date в YYYY-MM-DD строку для формы
   sex: z.enum(["male", "female", ""], {
      message: "Пол должен быть 'male' или 'female'.",
   }),
   email: z.string().email({ message: "Неверный формат email." }),
   number: z
      .string()
      .regex(/^\+?[0-9\s\-()]*$/, {
         message: "Неверный формат номера телефона.",
      }),
});

export type FormInput = z.input<typeof formSchema>; 
export type FormOutput = z.output<typeof formSchema>; 

export const formFields = [
   {
     name: "name",
     label: "Name",
     placeholder: "Vittorio",
   },
   {
     name: "surname",
     label: "Surname",
     placeholder: "Monti",
   },
   {
     name: "sex",
     label: "Sex",
     placeholder: "male or female",
     description: "Enter male or female or leave input empty if there is no information.",
   },
   {
     name: "dateOfBirth",
     label: "Date of Birth",
     placeholder: "23.01.1999",
     description: "Enter date in DD.MM.YYY format",
   },
   {
     name: "email",
     label: "Email",
     placeholder: "vittorio@gmail.com",
     type: "email",
   },
   {
     name: "number",
     label: "Number",
     placeholder: "+79219066619",
   },
] as const;