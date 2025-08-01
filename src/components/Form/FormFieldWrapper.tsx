import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path  } from "react-hook-form";

// Объявляем компонент дженериком с типом TFormValues
interface FormFieldWrapperProps<TFormValues extends FieldValues> {
   name: Path<TFormValues>; // Имя поля должно быть одним из ключей объекта TFormValues
   control: Control<TFormValues>; // Теперь control принимает конкретный тип
   label: string;
   placeholder: string;
}

const FormFieldWrapper = <TFormValues extends FieldValues>({
   name,
   control,
   label,
   placeholder,
}: FormFieldWrapperProps<TFormValues>) => {
   return (
      <FormField
         key={name as string} // ключ должен быть строкой
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel>{label}</FormLabel>
               <FormControl>
                  <Input placeholder={placeholder} {...field} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

export default FormFieldWrapper;
