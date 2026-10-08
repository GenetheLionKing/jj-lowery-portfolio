"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  PatchEvent,
  insert,
  set,
  setIfMissing,
  unset,
  type BlockProps,
  type ObjectInputProps,
  type Path,
} from "sanity";
import {
  alignmentStyle,
  blockAlignment,
  textAlignments,
  type TextAlignment,
} from "../content/about-presentation";

type SectionInput = Pick<
  ObjectInputProps,
  "path" | "value" | "readOnly" | "onChange"
>;
const AboutSectionContext = createContext<SectionInput | undefined>(undefined);

/** The public input callback accepts patches relative to this section object. */
export function AboutSectionInput(props: ObjectInputProps) {
  const { path, value, readOnly, onChange } = props;
  const section = useMemo(
    () => ({ path, value, readOnly, onChange }),
    [path, value, readOnly, onChange],
  );
  return (
    <AboutSectionContext.Provider value={section}>
      {props.renderDefault(props)}
    </AboutSectionContext.Provider>
  );
}

export function aboutAlignmentPath(
  blockPath: Path,
  sectionPath: Path,
): Path | undefined {
  const bodyName = blockPath.at(-2);
  const sectionKey = sectionPath[1];
  const blockSectionKey = blockPath[1];
  if (
    blockPath.length !== 4 ||
    sectionPath.length !== 2 ||
    sectionPath[0] !== "sections" ||
    blockPath[0] !== "sections" ||
    typeof sectionKey !== "object" ||
    !("_key" in sectionKey) ||
    typeof blockSectionKey !== "object" ||
    !("_key" in blockSectionKey) ||
    sectionKey._key !== blockSectionKey._key ||
    typeof bodyName !== "string" ||
    !["body", "leftBody", "rightBody"].includes(bodyName)
  )
    return undefined;
  return [`${bodyName}Alignments`];
}

/** Target only keyed presentation metadata; never replace native rich text. */
export function aboutAlignmentPatches(
  path: Path,
  key: string,
  alignment: TextAlignment,
  current: unknown,
  activeKeys?: Set<string>,
) {
  const cleanup =
    Array.isArray(current) && activeKeys
      ? current
          .filter(
            (item) =>
              typeof item?._key === "string" &&
              item._key !== key &&
              !activeKeys.has(item._key),
          )
          .map((item) => unset([...path, { _key: item._key }]))
      : [];
  const existing =
    Array.isArray(current) && current.some((item) => item?._key === key);
  const itemPath = [...path, { _key: key }];
  if (alignment === "left")
    return [...cleanup, ...(existing ? [unset(itemPath)] : [])];
  if (existing) return [...cleanup, set(alignment, [...itemPath, "alignment"])];
  return [
    ...cleanup,
    setIfMissing([], path),
    insert([{ _type: "aboutTextAlignment", _key: key, alignment }], "after", [
      ...path,
      -1,
    ]),
  ];
}

/** Extend Sanity's supported block renderer; keep its native editable content. */
export function AboutTextBlock(props: BlockProps) {
  const section = useContext(AboutSectionContext);
  const [controlsFocused, setControlsFocused] = useState(false);
  const alignmentPath = section
    ? aboutAlignmentPath(props.path, section.path)
    : undefined;
  const current = alignmentPath
    ? section?.value?.[alignmentPath[0] as string]
    : undefined;
  const bodyName = props.path.at(-2);
  const body =
    typeof bodyName === "string" ? section?.value?.[bodyName] : undefined;
  const readOnly = props.readOnly || section?.readOnly;
  const alignment = blockAlignment(current, props.value._key);
  return (
    <div
      style={alignmentStyle(alignment)}
      onFocusCapture={() => setControlsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setControlsFocused(false);
      }}
    >
      {(props.focused || props.selected || controlsFocused) && (
        <div
          contentEditable={false}
          role="group"
          aria-label="Paragraph alignment"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "4px 0",
            textAlign: "left",
          }}
        >
          {textAlignments.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Align paragraph ${value}`}
              aria-pressed={alignment === value}
              disabled={readOnly || !alignmentPath}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!readOnly && alignmentPath && section) {
                  const activeKeys = Array.isArray(body)
                    ? new Set<string>(
                        body
                          .filter((item) => item?._type === "block")
                          .map((item) => item._key),
                      )
                    : undefined;
                  const patches = aboutAlignmentPatches(
                    alignmentPath,
                    props.value._key,
                    value,
                    current,
                    activeKeys,
                  );
                  if (patches.length)
                    section.onChange(PatchEvent.from(patches));
                }
              }}
              style={{
                font: "inherit",
                fontSize: 12,
                color: "inherit",
                background: "transparent",
                border: "1px solid currentColor",
                borderRadius: 3,
                padding: "5px 8px",
                fontWeight: alignment === value ? 700 : 400,
              }}
            >
              {value === "left"
                ? "Left"
                : value === "center"
                  ? "Center"
                  : "Right"}
            </button>
          ))}
        </div>
      )}
      {props.renderDefault(props)}
    </div>
  );
}
