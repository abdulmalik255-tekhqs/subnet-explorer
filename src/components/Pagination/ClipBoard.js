import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ASSETS from "../../assets";

const ClipBoardComponet = ({ val, message }) => {
  return (
    <>
      <CopyToClipboard text={val} onCopy={() => toast.success(message)}>
        <img src={ASSETS.copy} className="cursor-pointer" alt="Copy" />
      </CopyToClipboard>
    </>
  );
};

export default ClipBoardComponet;
