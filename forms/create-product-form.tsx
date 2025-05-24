"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { productDefaultValues } from "@/lib/constants";
import { insertProductScheme, updateProductScheme } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type CreateFormProps = {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
};

export default function CreateProductForm({
  type,
  product,
  productId,
}: CreateFormProps) {
  const router = useRouter();

  // i found zod didn't like these so i separated them to make it work.
  const schema = type === "Update" ? updateProductScheme : insertProductScheme;
  const values = product && type === "Update" ? product : productDefaultValues;

  const form = useForm<z.infer<typeof insertProductScheme>>({
    resolver: zodResolver(schema),
    defaultValues: values,
  });

  //@ts-expect-error - i will fix this error
  async function submitProduct(values) {
    if (type === "Create") {
      const response = await createProduct(values);
      if (!response.success) {
        toast("Error", {
          description: response.message,
        });
      } else {
        toast("Product added successfully");
        router.push("/admin/products");
      }
    }

    //on update
    if (type === "Update") {
      if (!product?.id) {
        router.push("/admin/products");
      }

      const response = await updateProduct({ ...values, id: product?.id });
      if (!response.success) {
        toast("Error", {
          description: "Something went wrong",
        });
      } else {
        toast("Product updated successfully");
        router.push("/admin/products");
      }
    }
  }

  const images = form.watch("images");

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        method="POST"
        onSubmit={form.handleSubmit(submitProduct)}
      >
        <div className="flex flex-col gap-5 md:flex-row items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      variant={"default"}
                      className="mt-2"
                      onClick={() =>
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        )
                      }
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount in stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="space-x-2 flex-start">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                    </div>
                    <FormControl>
                      <UploadButton
                        endpoint={"imageUploader"}
                        onClientUploadComplete={(
                          response: { url: string }[]
                        ) => {
                          form.setValue("images", [...images, response[0].url]);
                        }}
                        onUploadError={(error: Error) => {
                          toast("Image Upload Error", {
                            description: "Image not Uploaded",
                          });
                        }}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">isfeatured</div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size={"lg"}
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
