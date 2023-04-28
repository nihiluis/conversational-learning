import classNames from "classnames"
import { ChatPhase } from "~/state"

interface Props {
  phase: ChatPhase
  setPhase: (phase: ChatPhase) => void
}

export default function ProcessSteps({ phase, setPhase }: Props) {
  const isActivePhase = phase === "active"
  const isConstructivePhase = phase === "constructive"
  const isInteractivePhase = phase === "interactive"

  return (
    <ul className="steps">
      <Step
        label="Learn"
        active={isActivePhase || isConstructivePhase || isInteractivePhase}
        setActive={() => setPhase("active")}
      />
      <Step
        label="Test"
        active={isConstructivePhase || isInteractivePhase}
        setActive={() => setPhase("constructive")}
      />
      <Step
        label="Apply"
        active={isInteractivePhase}
        setActive={() =>
          setPhase(isConstructivePhase || isInteractivePhase ? "interactive" : "constructive")
        }
      />
    </ul>
  )
}

interface StepProps {
  active: boolean
  label: string
  setActive: () => void
}
function Step({ active, setActive, label }: StepProps) {
  const classes = classNames("step cursor-pointer", {
    "before:!bg-green-300 after:!bg-green-300": active,
    "before:!bg-white after:!bg-white": !active,
  })

  return (
    <li className={classes} onClick={setActive}>
      {label}
    </li>
  )
}
