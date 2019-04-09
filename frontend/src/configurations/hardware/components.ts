import { IComponent, ConnectorPinMode } from "./types";

import SevenSegmentImage from "../../images/hardware/zumjunior-7segment.svg";
import ButtonImage from "../../images/hardware/zumjunior-button.svg";
import DoubleLedImage from "../../images/hardware/zumjunior-double-led.svg";
import MiniservoImage from "../../images/hardware/zumjunior-miniservo.svg";
import SensorsImage from "../../images/hardware/zumjunior-sensors.svg";
import ServoImage from "../../images/hardware/zumjunior-servo.svg";
import SliderImage from "../../images/hardware/zumjunior-slider.svg";

export const components: Partial<IComponent>[] = [
  {
    name: "Component"
  },
  {
    name: "Digital",
    extends: "Component",
    code: {
      globals: [
        `{% for pin in pinsInfo %}
        uint8_t {{pin.pinVarName}} = {{pin.pinNumber}} ;
        {% endfor %}`
      ]
    }
  },
  {
    name: "DigitalInput",
    extends: "Digital",
    onValue: "HIGH",
    offValue: "LOW",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},INPUT);
        {% endfor %}`
      ]
    },
    actions: [
      {
        name: "read",
        parameters: ["pin"],
        code: "digitalRead({{pin}})",
        returns: "uint8_t"
      }
    ]
  },
  {
    name: 'DigitalOutput',
    extends: 'Digital',
    onValue: 'HIGH',
    offValue: 'LOW',
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        {% endfor %}`,
      ],
    },
    actions: [
      {
        name: 'write',
        parameters: ['pinVarName', 'value'],
        code: `digitalWrite({{pinVarName}}, {{value}})`,
      },
    ],
  },
  {
    name: "Button",
    extends: "DigitalInput"
  },
  {
    name: "Led",
    extends: "DigitalOutput"
  },
  {
    name: "ZumjuniorButton",
    extends: "Button",
    instanceName: "bloq-button-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "Pin",
            mode: ConnectorPinMode.INPUT,
            portPin: "0"
          }
        ]
      }
    ],
    image: {
      url: ButtonImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "DoubleLed",
    extends: "Led"
  },
  {
    name: "ZumjuniorDoubleLed",
    extends: "DoubleLed",
    onValue: "LOW",
    offValue: "HIGH",
    instanceName: "bloq-led-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "WhitePin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "0"
          },
          {
            name: "ColorPin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "1"
          }
        ]
      }
    ],
    image: {
      url: DoubleLedImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "DoubleSwitch",
    extends: "DigitalInput"
  },
  {
    name: "ZumjuniorSwitch",
    extends: "DoubleSwitch",
    instanceName: "bloq-switch-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "Pin1",
            mode: ConnectorPinMode.INPUT,
            portPin: "0"
          },
          {
            name: "Pin2",
            mode: ConnectorPinMode.INPUT,
            portPin: "1"
          }
        ]
      }
    ],
    image: {
      url: SliderImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "I2C",
    extends: "Component"
  },
  {
    name: "SevenSegment",
    extends: "I2C"
  },
  {
    name: "ZumjuniorSevenSegment",
    extends: "SevenSegment",
    instanceName: "bloq-seven-segment-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-i2c",
        position: {
          x: 0.28,
          y: 1
        },
        pins: []
      }
    ],
    image: {
      url: SevenSegmentImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "Servo",
    extends: "DigitalOutput",
  },
  {
    name: "ZumjuniorServo",
    extends: "Servo",
    instanceName: "bloq-servo-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: []
      }
    ],
    image: {
      url: ServoImage,
      width: 120,
      height: 132
    }
  },
  {
    name: "ZumjuniorMiniservo",
    extends: "Servo",
    instanceName: "bloq-miniservo-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: []
      }
    ],
    image: {
      url: MiniservoImage,
      width: 88,
      height: 95
    }
  },
  {
    name: "ZumjuniorSensors",
    extends: "I2C",
    instanceName: "bloq-sensors-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-i2c",
        position: {
          x: 0.28,
          y: 1
        },
        pins: []
      }
    ],
    image: {
      url: SensorsImage,
      width: 123,
      height: 124
    }
  },
];
