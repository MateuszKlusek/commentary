import { Button as ButtonComponent } from "../ui/library/atoms/Button";

export interface ButtonProps {
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  label,
  onClick = () => { },
}: ButtonProps) => {
  return (

    <ButtonComponent onClick={onClick}>
      <span>{label}</span>
    </ButtonComponent>
  );
};
