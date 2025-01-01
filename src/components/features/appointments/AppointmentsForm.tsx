import { FC, FormEventHandler, useState } from "react";
import { FormField } from "../../ui/FormField/FormField";
import { Button } from "../../ui/Button/Button";
import { Calendar } from "../Calendar/Calendar";
import { Dialog } from "../Dialog/Dialog";

export const AppointmentsForm: FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  const availableTimes: Record<string, string[]> = {
    "2025-01-10": ["10:00", "11:00", "15:00"],
    "2025-01-15": ["12:00", "14:00", "16:00"],
  };

  const handleDayClick = (formattedDate: string) => {
    setSelectedDate(formattedDate);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedDate(null);
  };

  return (
    <form className="appointments-form" onSubmit={handleSubmit}>
      <div className="appointments-form__wrapper">
        <FormField label="Имя">
          <input
            type="text"
            name="name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </FormField>
        <FormField label="Фамилия">
          <input
            type="text"
            name="surname"
            onChange={(event) => setSurname(event.target.value)}
            value={surname}
          />
        </FormField>
        <FormField label="Телефон">
          <input
            type="tel"
            name="phone"
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </FormField>
        <Button
          className="appointments-form__submit"
          type="submit"
          title="Отправить заявку"
          variant="primary"
        />
      </div>

      <Calendar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDayClick={handleDayClick}
      />

      {isDialogOpen && (
        <Dialog
          selectedDate={selectedDate}
          availableTimes={availableTimes[selectedDate!] || []}
          onClose={closeDialog}
          onTimeSelect={handleTimeSelect}
        />
      )}
    </form>
  );
};
