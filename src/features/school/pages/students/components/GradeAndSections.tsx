// import { useQuery } from "@apollo/client";
// import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
// import { SelectItem } from "@heroui/select";
// import React from "react";
// import { Controller, useFormContext } from "react-hook-form";

// import { CreateStudentSchemaType } from "../../schemas/CreateStudentSchema";
// import { GRADES_QUERY, SECTIONS_QUERY } from "../../services/queries";
// import { GradeListResponse, SectionListResponse } from "../../services/types";

// import { Select } from "@/components/ui";

// export default function GradeAndSections() {
//   const { control } = useFormContext<CreateStudentSchemaType>();

//   //LIST GRADES QUERY
//   const { data: grades = { grades: [] }, loading: isLoadingGrades } =
//     useQuery<GradeListResponse>(GRADES_QUERY);

//   //LIST SECTIONS QUERY
//   const { data: sections = { sections: [] }, loading: isLoadingSections } =
//     useQuery<SectionListResponse>(SECTIONS_QUERY);

//   // const selectedSection: number | undefined =
//   //   useWatch({
//   //     control,
//   //     name: "sectionId",
//   //   }) || undefined;

//   // const handleChangeSection = (sectionId: number) => {
//   //   setValue("sectionId", sectionId === selectedSection ? null : sectionId);
//   // };

//   return (
//     <React.Fragment>

//       {/* <div className="flex w-full flex-col gap-3">
//         <p
//           className={twMerge(
//             "required ms-0.5 text-sm",
//             errors?.sectionId?.message && "text-danger",
//           )}
//         >
//           Section
//         </p>

//         <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2">
//           {isLoadingSections
//             ? Array.from({ length: 26 }).map((_, i) => (
//                 <Skeleton key={i} className="w-10 rounded-lg">
//                   <div className="h-10 w-10 rounded-lg bg-default-200" />
//                 </Skeleton>
//               ))
//             : sections?.sections?.map((section, i) => {
//                 const selected = selectedSection === section.id;

//                 return (
//                   <motion.label
//                     key={section.id}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="relative isolate w-min cursor-pointer"
//                     htmlFor={section.section}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     transition={{ duration: 0.3, delay: i * 0.07 }}
//                   >
//                     <input
//                       checked={selected}
//                       className="peer sr-only"
//                       id={section.section}
//                       name="section"
//                       type="radio"
//                       onChange={() => handleChangeSection(section.id)}
//                     />

//                     <AnimatePresence mode="wait">
//                       {selected && (
//                         <motion.div
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="absolute -right-1 -top-1 z-[999] rounded-md bg-primary p-0.5"
//                           exit={{ scale: 0, opacity: 0 }}
//                           initial={{ opacity: 0, scale: 0 }}
//                           transition={{ duration: 0.5, type: "spring" }}
//                         >
//                           <svg
//                             key={section.id}
//                             className="size-4 shrink-0 stroke-white"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth={2}
//                             viewBox="0 0 24 24"
//                           >
//                             <motion.path
//                               animate={{ pathLength: 1 }}
//                               d="M5 13l4 4L19 7"
//                               exit={{ pathLength: 0 }}
//                               initial={{ pathLength: 0 }}
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               transition={{
//                                 delay: 0.2,
//                                 type: "tween",
//                                 ease: "easeOut",
//                                 duration: 0.3,
//                               }}
//                             />
//                           </svg>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <Button
//                       as="span"
//                       className="relative size-10 min-w-0 p-0 px-0 peer-checked:border-primary"
//                       radius="sm"
//                       variant="bordered"
//                     >
//                       {section.section}
//                     </Button>
//                   </motion.label>
//                 );
//               })}
//         </div>
//         {errors?.sectionId && errors?.sectionId?.message && (
//           <small className="text-tiny text-danger">
//             {errors?.sectionId?.message}
//           </small>
//         )}
//       </div> */}
//     </React.Fragment>
//   );
// }
