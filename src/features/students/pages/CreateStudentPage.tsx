import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Tab, Tabs } from "@heroui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";

import { B2BStudentForm, B2CStudentForm } from "../components/CreateStudent";

import { title } from "@/components/primitives";
import { Button } from "@/components/ui";

const tabs = [
  {
    id: "b2c",
    label: "B2C",
    content: <B2CStudentForm />,
  },
  {
    id: "b2b",
    label: "B2B",
    content: <B2BStudentForm />,
  },
];

export default function CreateStudentPage() {
  const [selectedKey, setSelectedKey] = React.useState("b2c");

  return (
    <section className="flex flex-col gap-8">
      <div>
        <Breadcrumbs underline="hover">
          <BreadcrumbItem>
            <Link to="..">Students</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Add Student</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex items-center justify-between">
          <h1 className={title({ size: "lg" })}>Add Student</h1>
          <Button color="secondary">Bulk Upload</Button>
        </div>
      </div>

      <div className="rounded-xl bg-white px-1 py-16">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <div className="flex flex-col gap-y-1">
            <p className="text-sm">Business Type</p>
            <Tabs
              aria-label="Student Type"
              classNames={{
                tabList: "bg-white border-1 shadow-none",
              }}
              color="primary"
              radius="full"
              selectedKey={selectedKey}
              size="sm"
              variant="bordered"
              onSelectionChange={(key) => setSelectedKey(key as string)}
            >
              {tabs.map((tab) => (
                <Tab key={tab.id} title={tab.label} />
              ))}
            </Tabs>
          </div>

          <div>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={selectedKey}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                initial={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {tabs?.find((t) => t.id === selectedKey)?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
