import Editor from "../components/organisms/Editor";

export default function Home() {
  return (
    <section className="flex flex-col space-y-4 w-screen h-screen relative dark:text-gray-50">
      <Editor />
    </section>
  );
}
