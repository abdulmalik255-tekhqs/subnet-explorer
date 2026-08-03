import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa6";
import { toast } from "react-toastify";
// import ASSETS from "../../assets";

const ClipBoardComponet = ({ val, message, className }) => {
  return (
    <>
      <CopyToClipboard text={val} onCopy={() => toast.success(message)}>
        <FaRegCopy className={`cursor-pointer ${className ?? ""}`} />
      </CopyToClipboard>
    </>
  );
};

export default ClipBoardComponet;
