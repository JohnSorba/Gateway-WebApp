function Instructions() {
  const instructions = [
    {
      title: "School Time",
      text: "All exams must be scheduled within the school hours, specifically between 8:30 AM and 12:15 PM. This is to ensure that exams are completed before the school day ends.",
    },
    {
      title: "Exam Timing",
      text: "It is recommended to schedule exams for a class at 8:30 AM and 11:00 AM.",
    },
    {
      title: "Exam Duration",
      text: "The duration of an exam should be no less than 30 minutes and no more than 45 minutes.",
    },
    {
      title: "Subject Instances",
      text: "Only one instance of a subject can be included in an exam.",
    },
    {
      title: "Exams Per Day",
      text: "A class can have a maximum of two exams per day.",
    },
    {
      title: "Scheduling Conflicts",
      text: "When adding subjects, ensure to check the exam dates and times to avoid potential conflicts within a class. Two separate exams should not be scheduled at the same date and time for a class.",
    },
    {
      title: "Exam Scheduling",
      text: "Exams must be scheduled at least a day after the current date.",
    },
    {
      title: "Publishing Exams",
      text: "After adding subjects, the exam should be published for students to attempt based on their classes.",
    },
  ];

  return (
    <div className="w-full pb-16">
      <header className="header">
        <h2>Exam Creation Policy and Guidelines </h2>
      </header>

      <section className="py-2 px-4 mb-8 bg-blue-300 font-semibold rounded-full">
        <p>
          <em>NB:</em> Please ensure to adhere to these guidelines when creating
          exams to ensure a smooth and conflict-free exam schedule.
        </p>
      </section>

      <section className="my-0 mb-8 mx-auto w-3/6 text-md bg-yellow-50 rounded-xl py-8 px-6 shadow-xl p-6">
        <ul className="flex flex-col gap-4">
          {instructions.map((item, i) => (
            <li key={i} className="grid grid-cols-[40px_1fr] items-end">
              <span className="text-2xl font-semibold text-blue-500">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-center mb-4">
        <em>
          Reminder: These instructions and guidelines are enforced by the
          system!
        </em>
      </p>
      <footer className="border-t-2 border-yellow-300 pt-4 w-1/2 mx-auto">
        <div className="flex justify-center">
          <img src="/gateway_logo_final.png" alt="school-logo" />
        </div>
      </footer>
    </div>
  );
}

export default Instructions;
