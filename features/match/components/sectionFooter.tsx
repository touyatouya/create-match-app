import ListEmptyText from "../ListEmptyText";

interface SectionFooterProps {
  message: string;
  visible: boolean;
}

const SectionFooter: React.FC<SectionFooterProps> = ({ message, visible }) => {
  return visible ? <ListEmptyText message={message} /> : null;
};

export default SectionFooter;
