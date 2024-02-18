import { useEffect, useRef, useState } from "react";
import { ICircleWheelSelectBox } from "./circle-wheel-select-box.interface";
import styles from './circle-wheel-select-box.module.css';
import { arc, select } from "d3";
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';

export function CircleWheelSelectBox(props: ICircleWheelSelectBox.Props) {
  const {
    size,
    innerCircleSize,
    innerCircleContent,
    menuItems,
  } = props;
  const backgroundSvgRef = useRef<SVGSVGElement>(null);
  const innerCircleRef = useRef<HTMLDivElement>(null);
  const menuItemsKeyString = menuItems.map(k => k.key).join('_');

  const wheelContainerPressedCursorClientCoordinate = useRef<ICircleWheelSelectBox.Coordinate>();
  const isWheelContainerPressed = useRef(false);
  const [wheelDeg, setWheelDeg] = useState(0);

  function getItemRotateDeg(index: number): number {
    if (index === 0) {
      return 0;
    }
    const unit = 360 / menuItems.length;
    return unit * index;
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mousemove',
      eventListener(event) {
        pointerMove({
          client: {
            x: event.clientX,
            y: event.clientY,
          },
        });
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchmove',
      eventListener(event) {
        pointerMove({
          client: {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          },
        });
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mouseup',
      eventListener(event) {
        pointerUp();
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchend',
      eventListener(event) {
        pointerUp();
      },
    },
  });

  function pointerDown(cursorCoordinate: ICircleWheelSelectBox.Coordinate) {
    isWheelContainerPressed.current = true;
    wheelContainerPressedCursorClientCoordinate.current = cursorCoordinate;
  }

  function pointerMove(info: ICircleWheelSelectBox.PointerMoveInfo) {
    if (!isWheelContainerPressed.current) return;
    if (innerCircleRef.current === null) return;
    if (wheelContainerPressedCursorClientCoordinate.current === undefined) return;

    console.log('@pointerMove', info);

    const innerCircleClientRect = innerCircleRef.current.getBoundingClientRect();
    const pressStartedCursorCoordinate = wheelContainerPressedCursorClientCoordinate.current;
    const currentCursorCoordinate = info.client;
    const innerCircleCenterClientCoordinate: ICircleWheelSelectBox.Coordinate = {
      x: innerCircleClientRect.left + (innerCircleSize / 2),
      y: innerCircleClientRect.top + (innerCircleSize / 2),
    };

    const pressStartedCursorPosition = cursorPositionTargetInnerCircleCenter(pressStartedCursorCoordinate);
    const currentCursorPosition = cursorPositionTargetInnerCircleCenter(currentCursorCoordinate);

    // console.log('@innerCircleCenterClientCoordinate', innerCircleCenterClientCoordinate);
    // console.log('@pressStartedCursorPosition', pressStartedCursorPosition);

    let pressStartedA = 0;
    let pressStartedB = 0;
    pressStartedA = pressStartedCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    pressStartedB = pressStartedCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    // switch(pressStartedCursorPosition) {
    //   case 'top-left': {
    //     pressStartedA = innerCircleCenterClientCoordinate.x - pressStartedCursorCoordinate.x;
    //     pressStartedB = innerCircleCenterClientCoordinate.y - pressStartedCursorCoordinate.y;
    //   } break;
    //   case 'top-right': {
    //     pressStartedA = pressStartedCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    //     pressStartedB = innerCircleCenterClientCoordinate.y - pressStartedCursorCoordinate.y;
    //   } break;
    //   case 'bottom-right': {
    //     pressStartedA = pressStartedCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    //     pressStartedB = pressStartedCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    //   } break;
    //   case 'bottom-left': {
    //     pressStartedA = innerCircleCenterClientCoordinate.x - pressStartedCursorCoordinate.x;
    //     pressStartedB = pressStartedCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    //   } break;
    // }

    const startInitGravityDeg = Math.atan2(pressStartedA, pressStartedB) / (Math.PI / 180);
    console.log('@startInitGravityDeg', startInitGravityDeg);

    let currentA = 0;
    let currentB = 0;
    console.log('@currentCursorPosition', currentCursorPosition);
    currentA = currentCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    currentB = currentCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    // switch(currentCursorPosition) {
    //   case 'top-left': {
    //     currentA = innerCircleCenterClientCoordinate.x - currentCursorCoordinate.x;
    //     currentB = innerCircleCenterClientCoordinate.y - currentCursorCoordinate.y;
    //   } break;
    //   case 'top-right': {
    //     currentA = currentCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    //     currentB = innerCircleCenterClientCoordinate.y - currentCursorCoordinate.y;
    //   } break;
    //   case 'bottom-right': {
    //     currentA = currentCursorCoordinate.x - innerCircleCenterClientCoordinate.x;
    //     currentB = currentCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    //   } break;
    //   case 'bottom-left': {
    //     currentA = innerCircleCenterClientCoordinate.x - currentCursorCoordinate.x;
    //     currentB = currentCursorCoordinate.y - innerCircleCenterClientCoordinate.y;
    //   } break;
    // }
    console.log('currentA, currentB', { currentA, currentB });
    const currentGravityDeg = Math.atan2(currentA, currentB) / (Math.PI / 180);
    console.log('@currentGravityDeg', currentGravityDeg);

    let applyDeg = 0;
    if (startInitGravityDeg <= currentGravityDeg) {
      applyDeg = currentGravityDeg - startInitGravityDeg;
    } else {
      applyDeg = 360 - (startInitGravityDeg - currentGravityDeg);
    }

    setWheelDeg(applyDeg);



    // switch(pressStartedCursorPosition) {
    //   case 'top-left': {
    //     const a = innerCircleCenterClientCoordinate.x - pressStartedCursorCoordinate.x;
    //     const b = innerCircleCenterClientCoordinate.y - pressStartedCursorCoordinate.y;
    //     const startInitGravityDeg = Math.atan2(b, a) / (Math.PI / 180);
    //     console.log('@startInitGravityDeg', startInitGravityDeg);
    //     switch(currentCursorPosition) {
    //       case 'top-left': {
    //         const a = innerCircleCenterClientCoordinate.x - currentCursorCoordinate.x;
    //         const b = innerCircleCenterClientCoordinate.y - currentCursorCoordinate.y;
    //         console.log('a, b', { a, b });
    //         const currentGravityDeg = Math.atan2(b, a) / (Math.PI / 180);
    //         console.log('@currentGravityDeg', currentGravityDeg);
    //         // if ()
    //       } break;
    //       case 'top-right': {

    //       } break;
    //       case 'bottom-right': {

    //       } break;
    //       case 'bottom-left': {

    //       } break;
    //     } 
    //   } break;
    //   case 'top-right': {

    //   } break;
    //   case 'bottom-right': {

    //   } break;
    //   case 'bottom-left': {

    //   } break;
    // }
  }

  function pointerUp() {
    isWheelContainerPressed.current = false;
  }

  function cursorPositionTargetInnerCircleCenter(targetCoordinate: ICircleWheelSelectBox.Coordinate): ICircleWheelSelectBox.CursorPosition {
    let value: ICircleWheelSelectBox.CursorPosition = 'top-right';

    // console.log('@targetCoordinate', targetCoordinate);

    const innerCircle = innerCircleRef.current;
    if (innerCircle !== null) {
      const innerCircleClientRect = innerCircle.getBoundingClientRect();
      const innerCircleCenterClientCoordinate: ICircleWheelSelectBox.Coordinate = {
        x: innerCircleClientRect.left + (innerCircleSize / 2),
        y: innerCircleClientRect.top + (innerCircleSize / 2),
      };
      // console.log('@innerCircleCenterClientCoordinate', innerCircleCenterClientCoordinate);
      if (targetCoordinate.x <= innerCircleCenterClientCoordinate.x && targetCoordinate.y >= innerCircleCenterClientCoordinate.y) {
        value = 'bottom-left';
      } else if (targetCoordinate.x >= innerCircleCenterClientCoordinate.x && targetCoordinate.y >= innerCircleCenterClientCoordinate.y) {
        value = 'bottom-right';
      } else if (targetCoordinate.x >= innerCircleCenterClientCoordinate.x && targetCoordinate.y <= innerCircleCenterClientCoordinate.y) {
        value = 'top-right';
      } else if (targetCoordinate.x <= innerCircleCenterClientCoordinate.x && targetCoordinate.y <= innerCircleCenterClientCoordinate.y) {
        value = 'top-left';
      }
    }

    return value;
  }

  useEffect(() => {
    // console.log('1');
    if (backgroundSvgRef.current === null) return;
    const svg = backgroundSvgRef.current;

    const translateX = size / 2;
    const translateY = size / 2;
    const unitAngle = (Math.PI * 2) / menuItems.length;
    const startInitAngle = -(unitAngle / 2);

    const g = select(svg)
      .selectAll(`g[data-title='container']`)
      .data([NaN])
      .join(
        enter => enter.append('g'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'container')
      .attr('transform', `translate(${0}, ${0})`)
    ;

    g
      .selectAll(`path[data-title='bg-unit']`)
      .data(Array.from<number>({ length: menuItems.length }))
      .join(
        enter => enter.append('path'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'bg-unit')
      .attr('data-index', function(data: number, index: number, targetElements: any) {
        return index;
      })
      .nodes()
      .forEach((node, index) => {
        const startAngle = startInitAngle + (index * unitAngle);
        const endAgle = startAngle + unitAngle;

        select(node)
          .attr(
            'd', 
            arc<unknown>() 
              .innerRadius(innerCircleSize / 2) 
              .outerRadius(size / 2) 
              .startAngle(startAngle) 
              .endAngle(endAgle)
              .cornerRadius(0)
          )
          .style('fill', `rgb(${temprand(0, 255)}, ${temprand(0, 255)}, ${temprand(0, 255)})`)
          .attr('transform', `translate(${translateX}, ${translateY})`)
        ;
      })
    ;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemsKeyString, size, innerCircleSize]);

  return (
    <>
      <div 
        className={styles['container']} style={{ width: `${size}px`, height: `${size}px` }}
        onMouseDown={(event) => {
          pointerDown({
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onTouchStart={(event) => {
          pointerDown({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          });
        }}
        >
        <div className={styles['menu-list-wrapper']} style={{ transform: `rotate(${wheelDeg}deg)` }}>
          <div className={styles['menu-list-background']}>
            <svg className={styles['background-svg']} ref={backgroundSvgRef} width={size} height={size}></svg>
          </div>
          <ul className={styles['menu-list']}>
            {
              menuItems.map((item, index) => {
                return (
                  <li key={item.key} className={styles['item']} style={{ transform: `rotate(${getItemRotateDeg(index)}deg)` }}>
                    <div 
                      className={styles['item-content-wrapper']} 
                      style={{ height: `calc(100% - ${innerCircleSize / 2}px)` }} 
                      onClick={item.onClick}>
                      <div className={styles['item-content']} style={{ transform: `rotate(-${getItemRotateDeg(index)}deg)` }}>
                        <div className={styles['icon-area']}>
                          { item.icon }
                        </div>
                        <div className={styles['name-area']}>
                          { item.name }
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <div ref={innerCircleRef} className={styles['inner-circie-container']} style={{ width: `${innerCircleSize}px`, height: `${innerCircleSize}px` }}>
            { innerCircleContent }
          </div>
        </div>
      </div>
    </>
  );
}

function temprand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}