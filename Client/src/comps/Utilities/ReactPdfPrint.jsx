import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function ReactPdfPrint() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "emp-data",
    onAfterPrint: () => alert("Print success"),
  });

  return (
    <>
      <div
        ref={componentRef}
        style={{ width: "100%", height: window.innerHeight }}
      >
        <h1 className="text-center my-3 border py-2">Student Report</h1>
      </div>
      <button onClick={handlePrint}>Print this out</button>
    </>
  );
}

export default ReactPdfPrint;
