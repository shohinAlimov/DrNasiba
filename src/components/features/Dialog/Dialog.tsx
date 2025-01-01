import { FC } from "react";
import { DialogProps } from "../types/type";

export const Dialog: FC<DialogProps> = ({
  selectedDate,
  availableTimes,
  onClose,
  onTimeSelect,
}) => {
  return (
    <div className="dialog">
      <div className="dialog__content">
        <h2 className="dialog__title">Доступное время на {selectedDate}</h2>
        <ul className="dialog__times">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <li key={time}>
                <button
                  className="dialog__time-button"
                  onClick={() => onTimeSelect(time)}
                >
                  {time} — Забронировать
                </button>
              </li>
            ))
          ) : (
            <li>Нет доступного времени</li>
          )}
        </ul>
        <button className="dialog__close-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};
