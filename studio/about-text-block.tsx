"use client";

import { useState } from "react";
import {
  PatchEvent,
  insert,
  set,
  setIfMissing,
  unset,
  useFormCallbacks,
  useFormValue,
  type BlockProps,
  type Path,
} from "sanity";
import {
  alignmentStyle,
  blockAlignment,
  textAlignments,
  type TextAlignment,
} from "../content/about-presentation";

export function aboutAlignmentPath(blockPath: Path): Path | undefined {
  const bodyName = blockPath.at(-2);
  if (
    blockPath.length < 4 ||
    blockPath[0] !== "sections" ||
    typeof bodyName !== "string" ||
    !["body", "leftBody", "rightBody"].includes(bodyName)
  )
    return undefined;
  return [...blockPath.slice(0, -2), `${bodyName}Alignments`];
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
  const { onChange } = useFormCallbacks();
  const [controlsFocused, setControlsFocused] = useState(false);
  const alignmentPath = aboutAlignmentPath(props.path);
  const current = useFormValue(alignmentPath ?? props.path);
  const body = useFormValue(props.path.slice(0, -1));
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
              disabled={props.readOnly || !alignmentPath}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!props.readOnly && alignmentPath) {
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
                  if (patches.length) onChange(PatchEvent.from(patches));
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
