import { APP_NAME } from "@/lib/constants"

export default function Footer() {

  //get the year for the copy write date
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t ">
      <div className="p-5 flex-center">
        &copy; {currentYear} {APP_NAME}. All rights reserved
      </div>
    </footer>
  )
}

