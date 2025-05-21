import CreateProductForm from "@/forms/create-product-form"

export const metadata = {
  title: 'Create Product'
}
export default function ProductCreatePage() {
  return (
    <>
      <h1 className="h2-bold">Create Product</h1>
      <div className="my-8">
        <CreateProductForm type="Create" />
      </div>
    </>
  )
}

