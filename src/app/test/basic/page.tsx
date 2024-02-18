"use client"

import { CircleWheelSelectBox } from "@/components/circle-wheel-select-box/circle-wheel-select-box.component";
import { ICircleWheelSelectBox } from "@/components/circle-wheel-select-box/circle-wheel-select-box.interface";
import { useState } from "react";
import { TbAlertOctagonFilled, TbApple, TbBellFilled, TbBrandAws, TbBrandGithubFilled, TbBrandTwitterFilled, TbBrandVue } from "react-icons/tb";

export default function Page() {
  const [size, setSize] = useState(200);
  const [innerCircleSize, setInnerCircleSize] = useState(100);
  const [menuItems, setMenuItems] = useState<Array<ICircleWheelSelectBox.MenuItem>>([
    { key: '1', icon: <><TbApple /></>, name: <span className="text-xs">사과</span>, value: 'apple' },
    { key: '2', icon: <><TbAlertOctagonFilled /></>, name: <span className="text-xs">경고</span>, value: 'notice' },
    { key: '3', icon: <><TbBellFilled /></>, name: <span className="text-xs">알림</span>, value: 'alram' },
    { key: '4', icon: <><TbBrandAws /></>, name: <span className="text-xs">AWS</span>, value: 'aws' },
    { key: '5', icon: <><TbBrandGithubFilled /></>, name: <span className="text-xs">Github</span>, value: 'github' },
    { key: '6', icon: <><TbBrandTwitterFilled /></>, name: <span className="text-xs">X</span>, value: 'X' },
    { key: '7', icon: <><TbBrandVue /></>, name: <span className="text-xs">Vue</span>, value: 'Vue' },
  ]);

  return (
    <>
      <div>
        <h2>
          test/basic
        </h2>
      </div>
      <div className="p-4">
        <CircleWheelSelectBox
          size={size}
          innerCircleSize={innerCircleSize}
          innerCircleContent={<><div className="w-full h-full bg-blue-400"></div></>}
          menuItems={menuItems}
          onClick={(item) => {
            console.log('@clicked item', item);
          }}
          />
      </div>
      <div className="p-4">
        <button
          onClick={() => {
            setMenuItems([
              { key: '1', icon: <><TbApple /></>, name: <>사과</>, value: 'apple' },
              { key: '2', icon: <><TbAlertOctagonFilled /></>, name: <>경고</>, value: 'notice' },
            ]);
          }}>
          menuItems 바꾸기
        </button>
        <button
          onClick={() => {
            setSize(200);
            setInnerCircleSize(100);
          }}>
          size 바꾸기
        </button>
      </div>
    </>
  );
}