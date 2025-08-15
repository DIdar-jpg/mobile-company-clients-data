import { useEffect } from "react";
import { useDialog } from '@/context/DialogContext';

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
   DialogClose,
   DialogFooter,
} from "@/components/ui/dialog.tsx";
import FormFieldWrapper from './FormFieldWrapper'

import useClientMutation from "@/hooks/useClientMutation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema, formFields, type FormInput, type FormOutput } from './form.config'


const FormWrapper = ({ buttonText }: { buttonText: string}) => {

   const { mutate } = useClientMutation();

   const { setDialogOpen, selectedClient, setSelectedClient } = useDialog();

   const form = useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         surname: "",
         dateOfBirth: "",
         sex: "",
         email: "",
         number: "",
      },
   });
   
   useEffect(() => {
      if (selectedClient) {
         form.reset({
            name: selectedClient.name,
            surname: selectedClient.surname,
            dateOfBirth: selectedClient.dateOfBirth,
            sex: selectedClient.sex as "" | "male" | "female",
            email: selectedClient.email,
            number: selectedClient.number,
         });
      } else {
         form.reset({
            name: "",
            surname: "",
            dateOfBirth: "",
            sex: "",
            email: "",
            number: "",
         });
      }
   }, [selectedClient, form.reset]);

   const closeEditDialog = () => {
      setDialogOpen(false);
      setSelectedClient(null);
      form.reset(); 
   };

   function onSubmit(values: FormOutput) {
      mutate({
         method: selectedClient ? "put" : "post",
         url: selectedClient ? `${selectedClient.id}` : '',
         data: {
            ...values,
         },
      });
      closeEditDialog();
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full flex items-start justify-between gap-3 mb-5">
               {formFields.slice(0, 2).map((fieldConfig) => (
                  <FormFieldWrapper
                     key={fieldConfig.name}
                     name={fieldConfig.name}
                     control={form.control}
                     label={fieldConfig.label}
                     placeholder={fieldConfig.placeholder}
                  />
               ))}
            </div>
            {formFields.slice(2).map((fieldConfig) => (
               <FormFieldWrapper
                  key={fieldConfig.name}
                  name={fieldConfig.name}
                  control={form.control}
                  label={fieldConfig.label}
                  placeholder={fieldConfig.placeholder}
               />
            ))}
            <DialogFooter>
               <DialogClose asChild>
                  <Button
                     variant="outline"
                     type="button"
                     onClick={closeEditDialog}
                  >
                     Cancel
                  </Button>
               </DialogClose>
               <Button type="submit">{buttonText}</Button>
            </DialogFooter>
         </form>
      </Form>
   );
};
export default FormWrapper;
