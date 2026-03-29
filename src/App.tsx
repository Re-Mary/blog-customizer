import { CSSProperties, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import type { ArticleSidebarControls } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState } from './constants/articleProps';

import styles from './styles/index.module.scss';

export const App = () => {
	const [pageState, setPageState] = useState(defaultArticleState);
	const [isOpen, setIsOpen] = useState(false);

	const handleSidebarClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleSidebarToggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const sidebar: ArticleSidebarControls = useMemo(
		() => ({
			isOpen,
			onClose: handleSidebarClose,
			onToggle: handleSidebarToggle,
		}),
		[isOpen, handleSidebarClose, handleSidebarToggle]
	);

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': pageState.fontFamilyOption.value,
					'--font-size': pageState.fontSizeOption.value,
					'--font-color': pageState.fontColor.value,
					'--container-width': pageState.contentWidth.value,
					'--bg-color': pageState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm sidebar={sidebar} setPageState={setPageState} />
			<Article />
		</main>
	);
};
