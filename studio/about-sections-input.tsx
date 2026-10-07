"use client";

import { set, type ArrayOfObjectsInputProps } from "sanity";

/** Native Sanity unsets object arrays after their last removal. Keep [] here. */
export function AboutSectionsInput(props: ArrayOfObjectsInputProps) {
  return props.renderDefault({
    ...props,
    onItemRemove: (key: string) => {
      if (props.readOnly) return;
      if (props.value?.length === 1 && props.value[0]._key === key) {
        props.onChange(set([]));
      } else {
        props.onItemRemove(key);
      }
    },
  });
}
