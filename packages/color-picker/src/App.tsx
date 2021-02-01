import React, { useState, useMemo } from 'react';
import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";
import css from './app.module.css';

// isColor - ref https://stackoverflow.com/a/56266358/359825
const isColor = (strColor : string) => {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== '';
}

interface NewVarProps {
	onAdd?: Function;
}

const NewVar : React.FC<NewVarProps> = ({ onAdd }) => {
	const [ varName, setVarName ] = useState('');

	const onClick = () => {
		if(onAdd) {
			onAdd(varName);
			setVarName('');
		}
	}

	return <div>
		<input type="text" value={varName} onChange={(e) => setVarName(e.target.value)} />
		<button onClick={onClick}> Add css variable </button>
	</div>
};

interface ColorProps {
	color: string;
	onChange: (newColor: string) => void;
}

const Color : React.FC<ColorProps> = ({ color, onChange }) => {
	const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
	const onClick = () => {
		setShowColorPicker(!showColorPicker);
	}

	return (
		<div className={css.color} onClick={onClick} style={{ background: color }}>
			<div className={css.colorPicker}>
			{showColorPicker && <HexColorPicker color={color} onChange={onChange} />}
			</div>
		</div>
	);
}

type CSSVarDict = { [name: string]: string };

const App : React.FC = () => {
	const [cssVars, setCssVars] = useState({} as CSSVarDict);

	const code = useMemo(() => {
		const variablesAsCss = Object
			.keys(cssVars)
			.map((key) => `--${key}: ${cssVars[key]};`)
			.join("\n");

		return `body {\n${variablesAsCss}\n}`;
	}, [ cssVars ]);

	const onAdd = (name : string) =>
		setCssVars({ ...cssVars, [name]: '#fff' });

	const updateVar = (key : string, value : string) => {
		setCssVars({
			...cssVars,
			[key]: value
		});
	}

	const changeKey = (oldKey : string, newKey: string) => {
		const tmp = { ...cssVars };
		tmp[newKey] = tmp[oldKey];
		delete tmp[oldKey];
		setCssVars(tmp);
	}

	return <div className={css.app}>
		<h1> Color picker </h1>

		<h2> CSS variables </h2>
		<div>
		{
			Object.keys(cssVars).map((key, i) => (
				<div key={i}>
					<input type="text" value={key} onChange={(e) => changeKey(key, e.target.value)} />
					<input type="text" value={cssVars[key]} onChange={(e) => updateVar(key, e.target.value)} />
					{isColor(cssVars[key]) && <Color color={cssVars[key]} onChange={(value) => updateVar(key, value)} />}
				</div>
			))
		}
		</div>

		<h2> Add new </h2>
		<NewVar onAdd={onAdd}/>

		<h2> Code </h2>
		<pre><code>{code}</code></pre>
	</div>;
};

export default App;
