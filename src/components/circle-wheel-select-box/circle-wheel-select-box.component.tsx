import { useEffect, useRef, useState } from "react";
import { ICircleWheelSelectBox } from "./circle-wheel-select-box.interface";
import styles from './circle-wheel-select-box.module.css';
import { arc, select } from "d3";
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';

export function CircleWheelSelectBox(props: ICircleWheelSelectBox.Props) {
  const {
    containerClassName,
    size,
    innerCircleSize,
    innerCircleContent,
    menuItems,
    selectedMenuItem,
    defaultValue,
    onClick,
    onSelectedItem,
  } = props;
  const backgroundSvgRef = useRef<SVGSVGElement>(null);
  const innerCircleRef = useRef<HTMLDivElement>(null);
  const innerCircleVirtualRef = useRef<HTMLDivElement>(null);

  const wheelContainerPressedCursorClientCoordinate = useRef<ICircleWheelSelectBox.Coordinate>();
  const isWheelContainerPressed = useRef(false);
  const wheelContainerPressedTimestamp = useRef(0);

  const [isWheelReadjusting, setIsWheelReadjusting] = useState(false);
  const isWheelReadjustingSync = useRef(isWheelReadjusting);
  const [wheelDeg, setWheelDeg] = useState(0);
  const wheelDegSync = useRef(wheelDeg);
  const [wheelDegCommit, setWheelDegCommit] = useState(0);

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
    if (isWheelReadjustingSync.current) {
      return;
    }

    isWheelContainerPressed.current = true;
    wheelContainerPressedTimestamp.current = Date.now();
    wheelContainerPressedCursorClientCoordinate.current = cursorCoordinate;
  }

  function pointerMove(info: ICircleWheelSelectBox.PointerMoveInfo) {
    if (!isWheelContainerPressed.current) return;
    if (innerCircleVirtualRef.current === null) return;
    if (wheelContainerPressedCursorClientCoordinate.current === undefined) return;

    const innerCircleClientRect = innerCircleVirtualRef.current.getBoundingClientRect();
    const pressStartedCursorCoordinate = wheelContainerPressedCursorClientCoordinate.current;
    const currentCursorCoordinate = info.client;
    const innerCircleCenterClientCoordinate: ICircleWheelSelectBox.Coordinate = {
      x: innerCircleClientRect.left + (innerCircleSize / 2),
      y: innerCircleClientRect.top + (innerCircleSize / 2),
    };

    const pressStartedA = innerCircleCenterClientCoordinate.x - pressStartedCursorCoordinate.x;
    const pressStartedB = innerCircleCenterClientCoordinate.y - pressStartedCursorCoordinate.y;

    const startInitGravityDeg = Math.atan2(pressStartedB, pressStartedA) / (Math.PI / 180);

    const currentA = innerCircleCenterClientCoordinate.x - currentCursorCoordinate.x;
    const currentB = innerCircleCenterClientCoordinate.y - currentCursorCoordinate.y;
    const currentGravityDeg = Math.atan2(currentB, currentA) / (Math.PI / 180);

    let applyDeg = 0;
    if (startInitGravityDeg <= currentGravityDeg) {
      applyDeg = wheelDegCommit + (currentGravityDeg - startInitGravityDeg);
    } else {
      applyDeg = wheelDegCommit - (startInitGravityDeg - currentGravityDeg);
    }
    setWheelDeg(applyDeg);
    wheelDegSync.current = applyDeg;
  }

  function pointerUp() {
    if (isWheelContainerPressed.current) {
      isWheelReadjustingSync.current = true;
      setIsWheelReadjusting(isWheelReadjustingSync.current);
    }
    // isWheelReadjustingSync.current = true;
    // setIsWheelReadjusting(isWheelReadjustingSync.current);

    isWheelContainerPressed.current = false;
  }

  useEffect(() => {
    if (!isWheelReadjusting) return;

    const degUnit = 360 / menuItems.length;
    const degUnitHalf = degUnit / 2;
    const remain = wheelDegSync.current % degUnit;
    let _wheelDeg = wheelDegSync.current;

    // console.log('@remain', remain);

    if (remain > 0) {
      if (remain >= degUnitHalf) {
        const value = degUnit - remain;
        _wheelDeg += value;
      } else {
        const value = remain;
        _wheelDeg -= value;
      }
    } else if (remain < 0) {
      if (-degUnitHalf <= remain) {
        const value = -remain;
        _wheelDeg += value;
      } else {
        const temp = degUnit + remain;
        const value = temp;
        _wheelDeg -= value;
      }
    }

    // selected item 계산
    let wheelDegRemain = _wheelDeg % 360;
    if (wheelDegRemain < 0) wheelDegRemain = -wheelDegRemain;
    const selectedItem = menuItems.find((item, index) => {
      const currentItemDeg = degUnit * index;
      const difference = currentItemDeg - wheelDegRemain;
      return difference >= -2 && difference <= 2;
    });
    if (onSelectedItem !== undefined) {
      if (selectedItem?.value !== selectedMenuItem?.value) {
        onSelectedItem(selectedItem);
      }
    }
    
    setWheelDeg(_wheelDeg);
    wheelDegSync.current = _wheelDeg;
    setWheelDegCommit(_wheelDeg);

    setTimeout(() => {
      isWheelReadjustingSync.current = false;
      setIsWheelReadjusting(isWheelReadjustingSync.current);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWheelReadjusting]);

  useEffect(() => {
    if (isWheelReadjusting) return;
    if (selectedMenuItem !== undefined || defaultValue !== undefined) {
      let selectedValue = '';
      let selectedIndex = 0;
      if (selectedMenuItem !== undefined) {
        selectedValue = selectedMenuItem.value;
        selectedIndex = menuItems.findIndex(x => x.value === selectedValue);
      } else if (defaultValue !== undefined) {
        selectedValue = defaultValue;
        selectedIndex = menuItems.findIndex(x => x.value === selectedValue);
        const selectedItem = menuItems.find(x => x.value === selectedValue);
        if (onSelectedItem !== undefined) {
          onSelectedItem(selectedItem);
        }
      }

      const degUnit = 360 / menuItems.length;
      wheelDegSync.current = -(degUnit * (selectedIndex));
      setWheelDeg(wheelDegSync.current);
      setWheelDegCommit(wheelDegSync.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenuItem, defaultValue, menuItems, isWheelReadjusting]);

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
          // .style('fill', `rgb(${temprand(0, 255)}, ${temprand(0, 255)}, ${temprand(0, 255)})`)
          .style('fill', `rgb(255, 255, 255`)
          .attr('transform', `translate(${translateX}, ${translateY})`)
        ;
      })
    ;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, size, innerCircleSize]);

  return (
    <>
      <div 
        className={`${styles['container']} ${containerClassName ?? ''}`} style={{ width: `${size}px`, height: `${size}px` }}
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
        <div className={`${styles['menu-list-wrapper']} ${isWheelReadjusting ? styles['transition-300ms'] : ''}`} style={{ transform: `rotate(${wheelDeg}deg)` }}>
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
                      style={{ height: `calc(100% - ${innerCircleSize / 2}px)` }} >
                      <div className={styles['item-content-wrapper-2']} style={{ transform: `rotate(-${getItemRotateDeg(index)}deg)` }}>
                        <div 
                          onClick={() => {
                            if (Date.now() - wheelContainerPressedTimestamp.current >= 200) {
                              return;
                            }

                            if (onClick !== undefined) {
                              onClick(item);
                            }
                          }}
                          className={`${styles['item-content']} ${isWheelReadjusting ? styles['transition-300ms'] : ''}`} 
                          style={{ transform: `rotate(${-wheelDeg}deg)` }}>
                          <div className={styles['icon-area']}>
                            { 
                              (function(){
                                if (selectedMenuItem?.value === item.value && item.active !== undefined) {
                                  return item.active.icon;
                                }
                                return item.normal.icon;
                              })()
                            }
                          </div>
                          <div className={styles['name-area']}>
                            { 
                              (function(){
                                if (selectedMenuItem?.value === item.value && item.active !== undefined) {
                                  return item.active.name;
                                }
                                return item.normal.name;
                              })()
                            }
                          </div>
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
        <div ref={innerCircleVirtualRef} className={styles['virtual-inner-circle']} style={{ left: `calc(50% - ${innerCircleSize / 2}px)`, top: `calc(50% - ${innerCircleSize / 2}px)` }}>

        </div>
      </div>
    </>
  );
}

function temprand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}