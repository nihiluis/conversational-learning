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

  function setPhaseWrapper(phase: ChatPhase) {
    return function () {
      setPhase(phase)
    }
  }

  return (
    <ul className="steps">
      <Step
        label="Learn"
        active={isActivePhase || isConstructivePhase || isInteractivePhase}
        setActive={setPhaseWrapper("active")}
        unlocked
      />
      <Step
        label="Test"
        active={isConstructivePhase || isInteractivePhase}
        setActive={setPhaseWrapper("constructive")}
        unlocked={false}
      />
      <Step
        label="Apply"
        active={isInteractivePhase}
        setActive={setPhaseWrapper(
          isConstructivePhase || isInteractivePhase
            ? "interactive"
            : "constructive"
        )}
        unlocked={false}
      />
    </ul>
  )
}

interface StepProps {
  active: boolean
  label: string
  setActive: () => void
  unlocked: boolean
}
function Step({ active, setActive, label, unlocked }: StepProps) {
  const classes = classNames("step", {
    "before:!bg-green-300 after:!bg-green-300": active,
    "before:!bg-white after:!bg-white": !active,
    "cursor-pointer": unlocked,
  })

  return (
    <li className={classes} onClick={setActive}>
      <span className={classNames({ "text-gray-400": !unlocked })}>
        {label}
      </span>
    </li>
  )
}
