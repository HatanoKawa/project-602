import { expect, test } from "vitest";
import { EquipmentType } from "@/types/equipment-types";
import { tableData_Modifier } from "@/db";
import { tryParseModifier } from "@/utils/parser";
import { getModifierTableData } from "@/db/db-helper";
import { generateModifier } from "@/tests/test-utils";

test("尝试匹配修饰器： [锐]", () => {
  expect(tryParseModifier('锐'.split('').reverse()))
    .toEqual({
      isSuccess: true,
      res: generateModifier('锐')
    })
});

test("尝试匹配修饰器： [利]", () => {
  expect(tryParseModifier('利'.split('').reverse()))
    .toEqual({
      isSuccess: true,
      res: generateModifier('利')
    })
});

test("尝试匹配修饰器： [锐利]", () => {
  expect(tryParseModifier('锐利'.split('').reverse()))
    .toEqual({
      isSuccess: true,
      res: generateModifier('锐利')
    })
});

test("尝试匹配修饰器： [巨锐利]", () => {
  expect(tryParseModifier('锐利'.split('').reverse()))
    .toEqual({
      isSuccess: true,
      res: generateModifier('锐利')
    })
});