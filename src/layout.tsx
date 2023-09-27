import React from "react";

export const Layout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
      </header>
      {children}
    </div>
  );
};
