import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { RadioGroup } from 'src/ui/radio-group';

import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
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

	const updateFormField = useCallback((field: keyof ArticleStateType) => {
		return (value: OptionType) => {
			setFormState((prev) => ({
				...prev,
				[field]: value,
			}));
		};
	}, []);

	const fieldUpdaters = useMemo(
		() => ({
			fontFamilyOption: updateFormField('fontFamilyOption'),
			fontSizeOption: updateFormField('fontSizeOption'),
			fontColor: updateFormField('fontColor'),
			backgroundColor: updateFormField('backgroundColor'),
			contentWidth: updateFormField('contentWidth'),
		}),
		[updateFormField]
	);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setPageState(formState);
		sidebar.onClose();
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		setPageState(defaultArticleState);
		sidebar.onClose();
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
						onChange={fieldUpdaters.fontFamilyOption}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={fieldUpdaters.fontSizeOption}
					/>

					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={fieldUpdaters.fontColor}
					/>

					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={fieldUpdaters.backgroundColor}
					/>

					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={fieldUpdaters.contentWidth}
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
