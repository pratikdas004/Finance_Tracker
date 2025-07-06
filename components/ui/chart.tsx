// 'use client';

// import * as React from 'react';
// import * as RechartsPrimitive from 'recharts';
// import { TooltipProps } from 'recharts';

// import { cn } from '@/lib/utils';

// // Format: { THEME_NAME: CSS_SELECTOR }
// const THEMES = { light: '', dark: '.dark' } as const;

// export type ChartConfig = {
//   [k in string]: {
//     label?: React.ReactNode;
//     icon?: React.ComponentType;
//   } & (
//     | { color?: string; theme?: never }
//     | { color?: never; theme: Record<keyof typeof THEMES, string> }
//   );
// };

// type ChartContextProps = {
//   config: ChartConfig;
// };

// const ChartContext = React.createContext<ChartContextProps | null>(null);

// function useChart() {
//   const context = React.useContext(ChartContext);

//   if (!context) {
//     throw new Error('useChart must be used within a <ChartContainer />');
//   }

//   return context;
// }

// const ChartContainer = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<'div'> & {
//     config: ChartConfig;
//     children: React.ComponentProps<
//       typeof RechartsPrimitive.ResponsiveContainer
//     >['children'];
//   }
// >(({ id, className, children, config, ...props }, ref) => {
//   const uniqueId = React.useId();
//   const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

//   return (
//     <ChartContext.Provider value={{ config }}>
//       <div
//         data-chart={chartId}
//         ref={ref}
//         className={cn(
//           "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
//           className
//         )}
//         {...props}
//       >
//         <ChartStyle id={chartId} config={config} />
//         <RechartsPrimitive.ResponsiveContainer>
//           {children}
//         </RechartsPrimitive.ResponsiveContainer>
//       </div>
//     </ChartContext.Provider>
//   );
// });
// ChartContainer.displayName = 'Chart';

// const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
//   const colorConfig = Object.entries(config).filter(
//     ([_, config]) => config.theme || config.color
//   );

//   if (!colorConfig.length) {
//     return null;
//   }

//   return (
//     <style
//       dangerouslySetInnerHTML={{
//         __html: Object.entries(THEMES)
//           .map(
//             ([theme, prefix]) => `
// ${prefix} [data-chart=${id}] {
// ${colorConfig
//   .map(([key, itemConfig]) => {
//     const color =
//       itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
//       itemConfig.color;
//     return color ? `  --color-${key}: ${color};` : null;
//   })
//   .join('\n')}
// }
// `
//           )
//           .join('\n'),
//       }}
//     />
//   );
// };

// const ChartTooltip = RechartsPrimitive.Tooltip;

// interface CustomTooltipProps extends TooltipProps<number, string> {
//   className?: string;
//   hideLabel?: boolean;
//   hideIndicator?: boolean;
//   indicator?: 'line' | 'dot' | 'dashed';
//   nameKey?: string;
//   labelKey?: string;
//   labelClassName?: string;
// }

// const ChartTooltipContent = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
//   (
//     {
//       active,
//       payload,
//       className,
//       indicator = 'dot',
//       hideLabel = false,
//       hideIndicator = false,
//       label,
//       labelFormatter,
//       labelClassName,
//       formatter,
//       color,
//       nameKey,
//       labelKey,
//     },
//     ref
//   ) => {
//     const { config } = useChart();

//     const tooltipLabel = React.useMemo(() => {
//       if (hideLabel || !payload?.length) {
//         return null;
//       }

//       const [item] = payload;
//       const key = `${labelKey || item.dataKey || item.name || 'value'}`;
//       const itemConfig = getPayloadConfigFromPayload(config, item, key);
//       const value =
//         !labelKey && typeof label === 'string'
//           ? config[label as keyof typeof config]?.label || label
//           : itemConfig?.label;

//       if (labelFormatter) {
//         return (
//           <div className={cn('font-medium', labelClassName)}>
//             {labelFormatter(value, payload)}
//           </div>
//         );
//       }

//       if (!value) {
//         return null;
//       }

//       return <div className={cn('font-medium', labelClassName)}>{value}</div>;
//     }, [
//       label,
//       labelFormatter,
//       payload,
//       hideLabel,
//       labelClassName,
//       config,
//       labelKey,
//     ]);

//     if (!active || !payload || payload.length === 0) return null;

// // Type guard for payload items
// const validPayload = payload.filter(
//   (item): item is RechartsPrimitive.TooltipPayload<number, string> => 
//     item !== undefined && item !== null
// );

// if (validPayload.length === 0) return null;

//     const nestLabel = validPayload.length === 1 && indicator !== 'dot';

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
//           className
//         )}
//       >
//         {!nestLabel ? tooltipLabel : null}
//         <div className="grid gap-1.5">
//           {validPayload.map((item, index) => {
//             const key = `${nameKey || item.name || item.dataKey || 'value'}`;
//             const itemConfig = getPayloadConfigFromPayload(config, item, key);
//             const indicatorColor = color || item.payload.fill || item.color;

//             return (
//               <div
//                 key={item.dataKey}
//                 className={cn(
//                   'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
//                   indicator === 'dot' && 'items-center'
//                 )}
//               >
//                 {formatter && item?.value !== undefined && item.name ? (
//                   formatter(item.value, item.name, item, index, item.validPayload)
//                 ) : (
//                   <>
//                     {itemConfig?.icon ? (
//                       <itemConfig.icon />
//                     ) : (
//                       !hideIndicator && (
//                         <div
//                           className={cn(
//                             'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
//                             {
//                               'h-2.5 w-2.5': indicator === 'dot',
//                               'w-1': indicator === 'line',
//                               'w-0 border-[1.5px] border-dashed bg-transparent':
//                                 indicator === 'dashed',
//                               'my-0.5': nestLabel && indicator === 'dashed',
//                             }
//                           )}
//                           style={
//                             {
//                               '--color-bg': indicatorColor,
//                               '--color-border': indicatorColor,
//                             } as React.CSSProperties
//                           }
//                         />
//                       )
//                     )}
//                     <div
//                       className={cn(
//                         'flex flex-1 justify-between leading-none',
//                         nestLabel ? 'items-end' : 'items-center'
//                       )}
//                     >
//                       <div className="grid gap-1.5">
//                         {nestLabel ? tooltipLabel : null}
//                         <span className="text-muted-foreground">
//                           {itemConfig?.label || item.name}
//                         </span>
//                       </div>
//                       {item.value && (
//                         <span className="font-mono font-medium tabular-nums text-foreground">
//                           {item.value.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// );
// ChartTooltipContent.displayName = 'ChartTooltip';

// const ChartLegend = RechartsPrimitive.Legend;

// const ChartLegendContent = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<'div'> &
//     Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
//       hideIcon?: boolean;
//       nameKey?: string;
//     }
// >(
//   (
//     { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
//     ref
//   ) => {
//     const { config } = useChart();

//     if (!ayload?.length) {
//       return null;
//     }

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           'flex items-center justify-center gap-4',
//           verticalAlign === 'top' ? 'pb-3' : 'pt-3',
//           className
//         )}
//       >
//         {Payload.map((item) => {
//           const key = `${nameKey || item.dataKey || 'value'}`;
//           const itemConfig = getPayloadConfigFromPayload(config, item, key);

//           return (
//             <div
//               key={item.value}
//               className={cn(
//                 'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
//               )}
//             >
//               {itemConfig?.icon && !hideIcon ? (
//                 <itemConfig.icon />
//               ) : (
//                 <div
//                   className="h-2 w-2 shrink-0 rounded-[2px]"
//                   style={{
//                     backgroundColor: item.color,
//                   }}
//                 />
//               )}
//               {itemConfig?.label}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// );
// ChartLegendContent.displayName = 'ChartLegend';

// // Helper to extract item config from a payload.
// function getPayloadConfigFromPayload(
//   config: ChartConfig,
//   payload: RechartsPrimitive.TooltipPayload<number, string> | unknown,
//   key: string
// ) {
//   if (!payload || typeof payload !== 'object') {
//     return undefined;
//   }

//   const payloadWithData = payload as {
//     payload?: Record<string, unknown>;
//     [key: string]: unknown;
//   };

//   let configLabelKey = key;

//   if (key in payloadWithData && typeof payloadWithData[key] === 'string') {
//     configLabelKey = payloadWithData[key] as string;
//   } else if (
//     payloadWithData.payload &&
//     key in payloadWithData.payload &&
//     typeof payloadWithData.payload[key] === 'string'
//   ) {
//     configLabelKey = payloadWithData.payload[key] as string;
//   }

//   return configLabelKey in config
//     ? config[configLabelKey]
//     : config[key as keyof typeof config];
// }

// export {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
//   ChartStyle,
// };

'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';
import { Payload } from 'recharts/types/component/DefaultLegendContent';

// ... (keep your existing imports and constants)

type CustomTooltipPayload = Payload & {
  payload?: Record<string, unknown>;
  name?: string;
};

interface CustomTooltipProps extends TooltipProps<number, string> {
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  color?: string;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
  (props, ref) => {
    const {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    } = props;
    
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;

      const [item] = payload as CustomTooltipPayload[];
      const key = `${labelKey || item.payload?.dataKey || item.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-medium', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      return value ? <div className={cn('font-medium', labelClassName)}>{value}</div> : null;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload || payload.length === 0) return null;

    const validPayload = payload.filter(
      (item) => item !== undefined && item !== null
    );

    if (validPayload.length === 0) return null;

    const nestLabel = validPayload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {validPayload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item?.payload?.fill || item?.color;

            return (
              <div
                key={`${item.dataKey}-${index}`}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={{
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

function getPayloadConfigFromPayload(config: any, item: any, key: string) {
  // Implement your configuration lookup logic here
  return config[key];
}

function useChart(): { config: any; } {
  throw new Error('Function not implemented.');
}
