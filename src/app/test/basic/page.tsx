"use client"

import { CircleWheelSelectBox } from "@/components/circle-wheel-select-box/circle-wheel-select-box.component";
import { ICircleWheelSelectBox } from "@/components/circle-wheel-select-box/circle-wheel-select-box.interface";
import { useState } from "react";
import { TbAlertOctagonFilled, TbApple, TbBellFilled } from "react-icons/tb";

export default function Page() {
  const [size, setSize] = useState(200);
  const [innerCircleSize, setInnerCircleSize] = useState(100);
  const [menuItems, setMenuItems] = useState<Array<ICircleWheelSelectBox.MenuItem>>([
    {
      key: '1',
      icon: <>
        <TbApple />
      </>,
      name: <>
        사과
      </>,
      onClick: () => {
        console.log('사과 입니다.');
      },
    },
    {
      key: '2',
      icon: <>
        <TbAlertOctagonFilled />
      </>,
      name: <>
        경고
      </>,
      onClick: () => {
        console.log('경고 입니다.');
      },
    },
    {
      key: '3',
      icon: <>
        <TbBellFilled />
      </>,
      name: <>
        알림
      </>,
      onClick: () => {
        console.log('알림 입니다.');
      },
    },
  ]);

  return (
    <>
      <div>
        <h2>
          test/basic
        </h2>
      </div>
      <div>
        <CircleWheelSelectBox
          size={size}
          innerCircleSize={innerCircleSize}
          innerCircleContent={<><div className="w-full h-full bg-blue-400"></div></>}
          menuItems={menuItems}
          />
      </div>
      <div>
        <button
          onClick={() => {
            setMenuItems([
              {
                key: '1',
                icon: <>
                  <TbApple />
                </>,
                name: <>
                  사과
                </>,
                onClick: () => {
                  console.log('사과 입니다.');
                },
              },
              {
                key: '2',
                icon: <>
                  <TbAlertOctagonFilled />
                </>,
                name: <>
                  경고
                </>,
                onClick: () => {
                  console.log('경고 입니다.');
                },
              },
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