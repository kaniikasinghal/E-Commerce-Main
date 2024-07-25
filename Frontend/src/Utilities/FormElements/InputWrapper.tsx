import React, { FC } from "react";
import CommonInputBox from "./commonInputBox";
import { Control, FieldValues } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: string;
  type: string;
  control: Control<T, object>;
  value?: string;
  placeholder?: string;
  className:string
  onClick?:any
  onChange?:any
  checked?:any
}

const InputWrapper: FC<Props<any>> = ({
  name,
  type,
  placeholder,
  className,
  ...props
}) => {
  return (
    <div>
      <CommonInputBox
        className={className}
        type={type}
        placeholder={placeholder}
        name={name}
        {...props}
      />
    </div>
  );
};

export default InputWrapper;
