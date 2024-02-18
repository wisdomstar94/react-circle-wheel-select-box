import { useEffect, useRef } from "react";
import { ICircleWheelSelectBox } from "./circle-wheel-select-box.interface";
import styles from './circle-wheel-select-box.module.css';
import { arc, select } from "d3";

export function CircleWheelSelectBox(props: ICircleWheelSelectBox.Props) {
  const {
    size,
    innerCircleSize,
    innerCircleContent,
    menuItems,
  } = props;
  const backgroundSvgRef = useRef<SVGSVGElement>(null);
  const menuItemsKeyString = menuItems.map(k => k.key).join('_');

  function getItemRotateDeg(index: number): number {
    if (index === 0) {
      return 0;
    }
    const unit = 360 / menuItems.length;
    return unit * index;
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
      <div className={styles['container']} style={{ width: `${size}px`, height: `${size}px` }}>
        <div className={styles['menu-list-wrapper']}>
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
          <div className={styles['inner-circie-container']} style={{ width: `${innerCircleSize}px`, height: `${innerCircleSize}px` }}>
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