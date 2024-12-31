import { FC, FormEventHandler, useState } from "react";
import { FormField } from "../../ui/FormField/FormField";
import { Button } from "../../ui/Button/Button";

export const AppointmentsForm: FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Функция для вычисления дней в месяце
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Функция для генерации календаря
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay() || 7; // 1=Пн, 7=Вс
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDayOfWeek - 1).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    }

    return weeks;
  };

  const calendar = generateCalendar();

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
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
        <Button
          className="appointments-form__submit"
          type="submit"
          title="Отправить заявку"
          variant="primary"
        />
      </div>
      <div className="data-choice">
        <h2 className="data-choice__title">Выберите дату</h2>

        <span className="data-choice__date">
          <button className="btn data-choice__prev" onClick={handlePrevMonth}>
            &lt;
          </button>
          <span className="data-choice__month-year">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button className="btn data-choice__next" onClick={handleNextMonth}>
            &gt;
          </button>
        </span>
        <table className="calendar">
          <thead className="calendar__header">
            <tr className="calendar__row">
              <th className="calendar__day">Пн</th>
              <th className="calendar__day">Вт</th>
              <th className="calendar__day">Ср</th>
              <th className="calendar__day">Чт</th>
              <th className="calendar__day">Пт</th>
              <th className="calendar__day">Сб</th>
              <th className="calendar__day">Вс</th>
            </tr>
          </thead>
          <tbody className="calendar__body">
            {calendar.map((week, weekIndex) => (
              <tr key={weekIndex} className="calendar__week">
                {week.map((day, dayIndex) => (
                  <td key={dayIndex} className="calendar__cell">
                    <button
                      className={`btn calendar__button ${day ? "calendar__button--filled" : "calendar__button--empty"
                        }`}
                      disabled={!day} // Отключаем кнопку для пустых дней

                    >
                      {day || ""}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </form>
  );
};
