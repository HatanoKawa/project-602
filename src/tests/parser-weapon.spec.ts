import { expect, test } from "vitest";
import { EquipmentType } from "@/types/equipment-types";
import { getWeaponTableData } from "@/db/db-helper";
import { generateModifier, transformStr } from "@/tests/test-utils";
import { tryParseAsWeapon } from "@/utils/parser";

test("尝试匹配武器： [剑]", () => {
  expect(tryParseAsWeapon(transformStr('剑'), [0, 0], "l"))
    .toMatchObject({
      isSuccess: true,
      res: {
        type: EquipmentType.weapon,
        fullName: '剑',
        fullLength: 1,
        tableData: getWeaponTableData('剑'),
        modifiers: [
        ]
      }
    });
});

test("尝试匹配武器： [长剑]", () => {
  expect(tryParseAsWeapon(transformStr('长剑'), [0, 0], "l"))
    .toMatchObject({
      isSuccess: true,
      res: {
        type: EquipmentType.weapon,
        fullName: '长剑',
        fullLength: 2,
        tableData: getWeaponTableData('剑'),
        modifiers: [
          generateModifier('长'),
        ]
      }
    });
});

test("尝试匹配武器： [偃月刀]", () => {
  expect(tryParseAsWeapon(transformStr('偃月刀'), [0, 0], "l"))
    .toMatchObject({
      isSuccess: true,
      res: {
        type: EquipmentType.weapon,
        fullName: '偃月刀',
        fullLength: 3,
        tableData: getWeaponTableData('偃月刀'),
        modifiers: []
      }
    });
});

test("尝试匹配武器： [长长长青龙锐利偃月火刀]", () => {
  expect(tryParseAsWeapon(transformStr('长长长青龙锐利偃月火刀'), [0, 0], "l"))
    .toMatchObject({
      isSuccess: true,
      res: {
        type: EquipmentType.weapon,
        fullName: '长长长青龙锐利偃月火刀',
        fullLength: 11,
        tableData: getWeaponTableData('青龙偃月刀'),
        modifiers: [
          generateModifier('火'),
          generateModifier('锐利'),
          generateModifier('长'),
          generateModifier('长'),
          generateModifier('长'),
        ]
      }
    });
});
