import "./dogs.css";
import { DogImageDisplay } from "../image-display/dog-image-display";
import { Layout } from "../layout";

export const Dogs = () => {
  return (
    <Layout title="Dogs!">
      <div className="dogs-page">
        <DogImageDisplay />
      </div>
    </Layout>
  );
};
