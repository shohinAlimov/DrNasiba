import { AppointmentForm } from "../../components/features/Consultation/Consultation";
import { Header } from "../../components/ui/Header/Header";

export const Appointments = () => {
  return (
    <>
      <Header />
      <main>
        <section className="appointments">
          <div className="container">
            <AppointmentForm />
          </div>
        </section>
      </main>
    </>
  );
};
