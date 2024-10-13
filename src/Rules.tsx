import "./Rules.css";
import CheckMark from "@/components/CheckMark";
import { RULES } from "@/utils/assets";

interface Props {
  handleGoMenu: () => void;
}

const Rules = ({ handleGoMenu }: Props) => {
  return (
    <div className="rulesContainer">
      <h1>Rules</h1>
      <h2>Objective</h2>
      <p>{RULES.objective}</p>
      <h2>How to play</h2>
      <RuleList rules={RULES.howToPlay} />
      <CheckMark onClick={handleGoMenu} />
    </div>
  );
};

const RuleList = ({ rules }: { rules: string[] }) => (
  <ol>
    {rules.map((rule, index) => (
      <li key={index}>{rule}</li>
    ))}
  </ol>
);

export default Rules;
