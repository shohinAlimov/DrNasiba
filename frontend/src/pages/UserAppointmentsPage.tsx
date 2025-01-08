import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT in localStorage
        }
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDeleteClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointmentId) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      setAppointments(appointments.filter(app => app._id !== selectedAppointmentId));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting appointment');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
  };

  if (loading) return <div className="appointments-loading">Загрузка...</div>;
  if (error) return <div className="appointments-error">{error}</div>;
  if (!appointments.length) return <div className="appointments-empty">У вас нет записей</div>;

  return (
    <div className="my-appointments">
      <h2 className="my-appointments__title">Мои записи</h2>

      <div className="my-appointments__list">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="appointment-card">
            <div className="appointment-card__info">
              <div className="appointment-card__date">
                {formatDate(appointment.date)}
              </div>
              <div className="appointment-card__time">
                {appointment.time}
              </div>
            </div>
            <button
              className="appointment-card__delete"
              onClick={() => handleDeleteClick(appointment._id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal__content">
            <h3 className="delete-modal__title">Подтверждение удаления</h3>
            <p className="delete-modal__text">Вы уверены, что хотите удалить эту запись?</p>
            <div className="delete-modal__buttons">
              <button
                className="delete-modal__button delete-modal__button--confirm"
                onClick={handleConfirmDelete}
              >
                Я действительно хочу удалить мою запись
              </button>
              <button
                className="delete-modal__button delete-modal__button--cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
          <div className="delete-modal__overlay" onClick={() => setShowDeleteModal(false)} />
        </div>
      )}
    </div>
  );
};

export default MyAppointments;