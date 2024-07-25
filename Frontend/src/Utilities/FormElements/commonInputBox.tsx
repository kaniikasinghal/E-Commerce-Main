import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { Controller, Control } from "react-hook-form";

interface IProps extends InputHTMLAttributes<HTMLInputElement>{
  className: string;
  control: Control;
  type: string;
  placeholder?: string;
  name: string;
  fieldType?: string;
  value?: string;
  onChange?: (event: InputHTMLAttributes<HTMLInputElement>) => void;
}

const CommonInputBox: React.FC<IProps> = (props) => {
  const {
    type,
    className,
    placeholder,
    name,
    control,
    value,
    onChange
  } = props;

  return (
    <div className="right-icon-input">
      <Controller
        render={({ field }) => (
          <input
            {...field}
            type={type}
            className={className}
            value={field.value}
            placeholder={placeholder}
            onChange={(
              e: ChangeEvent<HTMLInputElement> | CustomEvent<HTMLInputElement>
            ) => {
              field.onChange(e);
              if (onChange) {
                onChange(e as CustomEvent<HTMLInputElement>);
              }
            }}
          />
        )}
        defaultValue={value || ''}
        name={name}
        control={control}
      />
    </div>
  );
};

export default CommonInputBox;
