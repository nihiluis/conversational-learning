import { Formik, Field, Form } from "formik"

export default function Onboarding() {
  return (
    <Formik
      initialValues={{
        organization: "",
        subject: "",
        course: "",
        lecture: "",
      }}
      onSubmit={async values => {
        await new Promise(r => setTimeout(r, 500))
        alert(JSON.stringify(values, null, 2))
      }}>
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field id="firstName" name="firstName" placeholder="Jane" />

        <label htmlFor="lastName">Last Name</label>
        <Field id="lastName" name="lastName" placeholder="Doe" />

        <label htmlFor="email">Email</label>
        <Field
          id="email"
          name="email"
          placeholder="jane@acme.com"
          type="email"
        />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  )
}
