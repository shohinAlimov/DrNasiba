import { AppointmentsForm } from "../../components/features/appointments/AppointmentsForm";
import { Header } from "../../components/ui/Header/Header";

export const Appointments = () => {
  return (
    <>
      <Header />
      <main>
        <section className="appointments">
          <div className="container">
            <AppointmentsForm />
          </div>
        </section>
      </main>
    </>
  );
};
