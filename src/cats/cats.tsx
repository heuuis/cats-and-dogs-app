import "./cats.css";
import { CatImageDisplay } from "../image-display/cat-image-display";
import { Layout } from "../layout";

export const Cats = () => {
  return (
    <Layout title="Cats!">
      <div className="cats-page">
        <CatImageDisplay />
      </div>
    </Layout>
  );
};
