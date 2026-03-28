import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { RadioGroup } from 'src/ui/radio-group';

import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { useEffect, useRef, useState } from 'react';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';

/** Состояние и колбэки сайдбара с формой — один объект для пропсов */
export type ArticleSidebarControls = {
	isOpen: boolean;
	onClose: () => void;
	onToggle: () => void;
};

export type ArticleParamsFormProps = {
	sidebar: ArticleSidebarControls;
	setPageState: React.Dispatch<React.SetStateAction<ArticleStateType>>;
};

export const ArticleParamsForm = ({
	sidebar,
	setPageState,
}: ArticleParamsFormProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const onCloseRef = useRef(sidebar.onClose);
	onCloseRef.current = sidebar.onClose;

	const [formState, setFormState] = useState(defaultArticleState);

	useEffect(() => {
		if (!sidebar.isOpen) return;

		const handleMouseDown = (event: MouseEvent) => {
			const { target } = event;
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				onCloseRef.current();
			}
		};

		window.addEventListener('mousedown', handleMouseDown);
		return () => window.removeEventListener('mousedown', handleMouseDown);
	}, [sidebar.isOpen]);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setPageState(formState);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		setPageState(defaultArticleState);
	};

	return (
		<div ref={rootRef} className={styles.sidebarRoot}>
			<ArrowButton isOpen={sidebar.isOpen} onClick={sidebar.onToggle} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: sidebar.isOpen,
				})}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as='h1' size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(selected) => {
							setFormState((prev) => ({
								...prev,
								fontFamilyOption: selected,
							}));
						}}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(selected) => {
							setFormState((prev) => ({
								...prev,
								fontSizeOption: selected,
							}));
						}}
					/>

					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(selected) => {
							setFormState((prev) => ({
								...prev,
								fontColor: selected,
							}));
						}}
					/>

					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(selected) => {
							setFormState((prev) => ({
								...prev,
								backgroundColor: selected,
							}));
						}}
					/>

					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(selected) => {
							setFormState((prev) => ({
								...prev,
								contentWidth: selected,
							}));
						}}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
