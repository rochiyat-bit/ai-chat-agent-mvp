import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("File uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
