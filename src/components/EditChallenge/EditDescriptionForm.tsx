import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { Editor } from "@ckeditor/ckeditor5-core";
import ImageUploadAdapter from "../../services/imageUploader";

interface EditDescriptionFormProps {
  teamId: string;
  description: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleDescriptionChange: (description: string) => void;
}
interface Loader {
  file: Promise<File | null>;
}

function ImageCustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (
    loader: Loader,
  ) => {
    return new ImageUploadAdapter(loader);
  };
}

function EditDescriptionForm({
  goToNextStep,
  goToPreviousStep,
  description,
  handleDescriptionChange,
}: EditDescriptionFormProps) {
  const [hasContent, setHasContent] = useState(false); // Track if there is content

  const handleChange = (value: string) => {
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  const onDescriptionChange = (data: string) => {
    handleDescriptionChange(data);
  };

  return (
    <>
      <h2 className="lg:w-[75%] mb-4">
        Give a description about the challenge that will help the user
        understand the deliverables.
      </h2>
      <div>
        <CKEditor
          // @ts-expect-error CKEditor types are incompatible between packages
          editor={ClassicEditor}
          config={{
            extraPlugins: [ImageCustomUploadAdapterPlugin], // Use the custom adapter for image uploads
          }}
          data={description}
          onChange={(_event, editor) => {
            const data = editor.getData();
            onDescriptionChange(data);
            setHasContent(data.trim() !== "");
          }}
          onReady={(editor) => {
            const initialData = editor.getData();
            setHasContent(initialData.trim() !== "");
          }}
        />
      </div>
      <div className="my-4">
        <button
          onClick={() => handleChange("previous")}
          className="btn px-12  mr-2 bg-black rounded disabled:opacity-50 font-normal text-white text-[16px] hover:bg-black border-none"
        >
          Previous
        </button>
        <button
          onClick={() => handleChange("next")}
          disabled={!hasContent}
          className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default EditDescriptionForm;
