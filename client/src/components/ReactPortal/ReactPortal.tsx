import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: JSX.Element;
  wrapperId: string;
};

const ReactPortal: React.FC<Props> = ({
  children,
  wrapperId = 'react-portal-wrapper',
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();

  function createWrapperAndAppendToBody(wrapperId: string): HTMLDivElement {
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('id', wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
  }

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId) as HTMLElement;
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      // delete the programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (!wrapperElement) return null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return createPortal(children, wrapperElement);
};

export default ReactPortal;
